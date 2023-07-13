import googleapis from "googleapis";
import { exists } from "$std/fs/mod.ts";
import { consoleDebug, consoleError } from "#util/Console.ts";
import { readJson, writeJson } from "../util/json.ts";
import {
  tokenDtoFromEntity,
  tokenDtoToEntity,
} from "../db/models/GoogleTokenDto.ts";
import { ITokenDto } from "../db/models/interfaces/GoogleToken.ts";
import { ConsoleTags } from "../util/globalEnums.ts";
import { jsonFolder } from "../util/globals.ts";

const authTags = [ConsoleTags.AUTH];

const isValidCreds = (json: ITokenDto) => {
  return (
    json.idToken &&
    json.accessToken &&
    json.refreshToken &&
    json.expiresIn &&
    json.tokenType &&
    json.scope
  );
};

export const readGoogleConfig = async (path?: string) => {
  const defaultPath = path ?? "google_client_config.json";
  const isExists = await exists(jsonFolder(defaultPath));
  if (!isExists) {
    return null;
  }
  const content = await readJson(defaultPath);
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

export const readGoogleCreds = async (path?: string) => {
  const defaultPath = path ?? "google_creds.json";
  const isExists = await exists(jsonFolder(defaultPath));
  if (!isExists) {
    return null;
  }

  const creds = await readJson(defaultPath);
  return tokenDtoFromEntity(creds);
};

export const writeGoogleCreds = async (code: string, path?: string) => {
  const config = await readGoogleConfig();
  if (config === null) return null;

  const apiUri = "https://oauth2.googleapis.com/token";
  const qsObj = {
    code,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.redirectUris[0],
    grant_type: "authorization_code",
  };

  let tokens = tokenDtoToEntity({});
  try {
    consoleDebug(
      "service/AuthGoogle/writeGoogleCreds, start flag",
      "",
      authTags
    );
    const respToken = await fetch(apiUri, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(qsObj),
    });

    if (respToken.status !== 200) return null;

    tokens = await respToken.json();
    consoleDebug(
      "service/AuthGoogle/writeGoogleCreds, end flag. Tokens",
      tokens,
      authTags
    );

    await writeJson("google_creds.json", tokens);
  } catch (error) {
    consoleError("service/AuthGoogle/writeGoogleCreds, errors ", error);
  }
  return tokens;
};

// TODO: another set using googleapis
// export const writeGoogleCredsByGoogleApi = async (
//   code: string,
//   path?: string
// ) => {
//   const config = await readGoogleConfig(path);
//   if (config === null) return null;
//
//   const { google } = googleapis;
//   const oAuth2Client = new google.auth.OAuth2(
//     config.clientId,
//     config.clientSecret,
//     config.redirectUris[0]
//   );
//
//   let tokens = tokenDtoFromEntity({});
//   try {
//     const respToken = await oAuth2Client.getToken(code);
//     tokens = tokenDtoFromEntity(respToken.tokens);
//     await writeJson("google_creds.json", tokens);
//   } catch (error) {
//     consoleError("tracing writeGoogleCreds, errors ", error);
//   }
//   return tokens;
// };

export const refreshGoogleCreds = async () => {
  const jsonConfig = await readGoogleConfig();
  if (jsonConfig === null) return null;

  const jsonCredsOld = await readGoogleCreds();
  if (jsonCredsOld === null) return null;

  const apiUri = "https://oauth2.googleapis.com/token";
  const qsObj = {
    refresh_token: jsonCredsOld.refreshToken as string,
    client_id: jsonConfig.clientId as string,
    client_secret: jsonConfig.clientSecret as string,
    grant_type: "refresh_token" as string,
  };

  let jsonCreds: ITokenDto = tokenDtoFromEntity({});
  try {
    const respRefresh = await fetch(apiUri, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(qsObj),
    });

    if (respRefresh.status !== 200) return null;

    const credEntity = await respRefresh.json();
    const jsonCredsNew = tokenDtoFromEntity(credEntity);
    jsonCreds = {
      idToken: jsonCredsNew.idToken ?? jsonCredsOld.idToken,
      accessToken: jsonCredsNew.accessToken ?? jsonCredsOld.accessToken,
      refreshToken: jsonCredsNew.refreshToken ?? jsonCredsOld.refreshToken,
      expiresIn: jsonCredsNew.expiresIn ?? jsonCredsOld.expiresIn,
      tokenType: jsonCredsNew.tokenType ?? jsonCredsOld.tokenType,
      scope: jsonCredsNew.scope ?? jsonCredsOld.scope,
    };

    if (isValidCreds(jsonCreds)) {
      await writeJson("google_creds.json", tokenDtoToEntity(jsonCreds));
    }

    consoleDebug("AuthGoogle/refreshGoogleCreds/refreshGoogleCreds, result: ", {
      old: jsonCredsOld,
      new: jsonCreds,
    });
  } catch (error) {
    consoleError("AuthGoogle/refreshGoogleCreds/refreshGoogleCreds, ", error);
  }
  return jsonCreds;
};

export const googleUserDetails = async (
  idToken: string,
  accessToken: string
) => {
  const apiUri = "https://www.googleapis.com/oauth2/v1/userinfo";
  const headerObj = {
    Authorization: `Bearer ${idToken}`,
  };
  const qsObj = new URLSearchParams({
    alt: "json",
    access_token: accessToken,
  });
  const url = `${apiUri}?${qsObj.toString()}`;
  consoleDebug("services/AuthGoogle/googleUserDetails, url: ", url);

  try {
    const resp = await fetch(url, {
      method: "GET",
      headers: headerObj,
    });
    if (resp.status !== 200) return null;
    const result = await resp.json();
    consoleDebug(
      "AuthGoogle/refreshGoogleCreds/googleUserDetails, resp: ",
      result
    );
    return result;
  } catch (error) {
    consoleError("AuthGoogle/refreshGoogleCreds/googleUserDetails, ", error);
  }
};
