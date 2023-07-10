import googleapis from "npm:googleapis@120.0.0";
import { LogConsole } from "../middleware/logger/LogHelpers.ts";
import { readJson, writeJson } from "./json.ts";

interface ITokenEntity {
  id_token: string | null;
  access_token: string | null;
  refresh_token: string | null;
  expires_in: number | null;
  token_type: string | null;
  scope: string;
}

interface ITokenDto {
  idToken: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresIn: number | null;
  tokenType: string | null;
  scope: string;
}

export const tokenDtoFromEntity = (payload: Partial<ITokenEntity>) => {
  return <ITokenDto>{
    idToken: payload?.id_token ?? null,
    accessToken: payload?.access_token ?? null,
    refreshToken: payload?.refresh_token ?? null,
    expiresIn: payload?.expires_in ?? null,
    tokenType: payload?.token_type ?? null,
    scope: payload?.scope ?? "",
  };
};

export const tokenDtoToEntity = (dto: Partial<ITokenDto>) => {
  return <ITokenEntity>{
    id_token: dto?.idToken ?? null,
    access_token: dto?.accessToken ?? null,
    refresh_token: dto?.refreshToken ?? null,
    expires_in: dto?.expiresIn ?? null,
    token_type: dto?.tokenType ?? null,
    scope: dto?.scope ?? null,
  };
};

export const getGoogleConfig = async (path?: string) => {
  const defaultPath = path ?? "google_client_config.json";
  const content = await readJson(defaultPath);
  LogConsole.debug("tracing getGoogleConfig, content", content);
  const token = content.web;
  return {
    clientId: token.client_id,
    projectId: token.project_id,
    authUri: token.auth_uri,
    tokenUri: token.token_uri,
    certUrl: token.auth_provider_x509_cert_url,
    clientSecret: token.client_secret,
    redirectUris: token.redirect_uris,
  };
};

export const writeGoogleCredsRaw = async (code: string, path?: string) => {
  const config = await getGoogleConfig();

  const apiUri = "https://oauth2.googleapis.com/token";
  const options = {
    code,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.redirectUris[0],
    grant_type: "authorization_code",
  };

  let tokens = tokenDtoFromEntity({});

  try {
    LogConsole.debug("tracing writeGoogleCredsRaw, start flag");
    const respToken = await fetch(apiUri, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(options),
    });
    const json = await respToken.json();
    LogConsole.debug("tracing writeGoogleCredsRaw, end flag. Tokens: ", json);
    tokens = tokenDtoFromEntity(json);

    await writeJson("google_creds.json", tokens);
  } catch (error) {
    LogConsole.debug("tracing writeGoogleCredsRaw, errors ", error);
  }
  return tokens;
};

export const writeGoogleCreds = async (code: string, path?: string) => {
  const config = await getGoogleConfig(path);

  const { google } = googleapis;
  const oAuth2Client = new google.auth.OAuth2(
    config.clientId,
    config.clientSecret,
    config.redirectUris[0]
  );

  const respToken = await oAuth2Client.getToken(code);
  const { tokens } = respToken;

  writeJson("google_creds.json", tokens);

  return tokens;
};

export const refreshGoogleCredsRaw = async () => {
  const { web: jsonConfig } = await readJson("google_client_config.json");
  const jsonCredsOld = await readJson("google_creds.json");
  const apiUri = "https://oauth2.googleapis.com/token";

  const options = {
    refresh_token: jsonCredsOld.refreshToken,
    client_id: jsonConfig.client_id,
    client_secret: jsonConfig.client_secret,
    grant_type: "refresh_token",
  };

  try {
    const respRefresh = await fetch(apiUri, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(options),
    });
    const jsonCredsNew = await respRefresh.json();
    const jsonCreds = {
      ...jsonCredsOld,
      ...tokenDtoFromEntity(jsonCredsNew),
    };

    await writeJson("google_creds.json", jsonCreds);

    // TODO: check returned jsonRefreshed by http status
    LogConsole.debug("tracing refreshOAuth, result:", {
      old: jsonCredsOld,
      new: tokenDtoFromEntity(jsonCredsNew),
    });
  } catch (error) {
    LogConsole.error("tracing refreshOAuth,  error:", error);
  }
};
