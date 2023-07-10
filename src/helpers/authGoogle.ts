import googleapis from "npm:googleapis@120.0.0";
import { LogConsole } from "../middleware/logger/LogHelpers.ts";
import { readJson, writeJson } from "./json.ts";

interface IToken {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  id_token: string;
}

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

  let tokens = {
    idToken: null,
    accessToken: null,
    refreshToken: null,
    expiresIn: null,
    tokenType: null,
    scope: "",
  };

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

    tokens.idToken = json.id_token;
    tokens.accessToken = json.access_token;
    tokens.refreshToken = json.refresh_token;
    tokens.expiresIn = json.expires_in;
    tokens.tokenType = json.token_type;
    tokens.scope = json.scope;

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
      idToken: jsonCredsNew.id_token ?? jsonCredsOld.idToken,
      accessToken: jsonCredsNew.access_token ?? jsonCredsOld.accessToken,
      refreshToken: jsonCredsNew.refresh_token ?? jsonCredsOld.refreshToken,
      expiresIn: jsonCredsNew.expires_in ?? jsonCredsOld.expiresIn,
      tokenType: jsonCredsNew.token_type ?? jsonCredsOld.tokenType,
      scope: jsonCredsNew.scope ?? jsonCredsOld.scope,
    };

    await writeJson("google_creds.json", jsonCreds);

    // TODO: check returned jsonRefreshed by http status
    LogConsole.debug("tracing refreshOAuth, result:", {
      old: jsonCredsOld.accessToken,
      new: jsonCreds,
    });
  } catch (error) {
    LogConsole.error("tracing refreshOAuth,  error:", error);
  }
};
