import { Context, Next, Router } from "oak/mod.ts";
import { google } from "npm:googleapis@120.0.0";
import { consoleDebug, consoleError } from "#util/Console.ts";
import {
  apiBad,
  apiInternalError,
  apiOk,
  apiRedirect,
  customBody,
} from "#util/HTTP.ts";
import { ITokenEntity } from "#db/models/interfaces/GoogleToken.ts";
import {
  googleUserDetails,
  readGoogleConfig,
  readGoogleCreds,
  refreshGoogleCreds,
  writeGoogleCreds,
} from "../services/AuthGoogle.ts";
import { apiUnauth } from "../util/HTTP.ts";

const withGoogle = (path: string) => `/api/google/${path}`;

export const routeAuth = (router: Router) => {
  router.get(withGoogle("register"), registerAuth);
  router.get(withGoogle("refresh"), verifyAndRefreshToken);
  router.get(withGoogle("verify"), verifyIdToken);
  router.get(withGoogle("userDetails"), getUserDetails);
};

export const registerAuth = async (context: Context, next: Next) => {
  const url = new URL(context.request.url);
  const obj = new URLSearchParams(url.search);
  const code = obj.get("code");

  const noResult = { action: "no credentials were written" };
  const noResultStatus = "BLANK";
  const hasResult = { action: "written google credentials" };

  let tokens: ITokenEntity | null = null;

  if (!code) {
    apiOk(context, { body: customBody(noResult, noResultStatus) });
    return;
  }

  try {
    tokens = await writeGoogleCreds(code as string);
  } catch (error) {
    consoleError("registerAuth, error: ", error);
    apiInternalError(context, { body: customBody({}) });
    return;
  }

  if (tokens === null) {
    apiOk(context, { body: customBody(noResult, noResultStatus) });
    return;
  }
  const tokenValues = <any[]>(tokens && Object.values(tokens));
  const invalidTokenValues = tokenValues.filter((v) => {
    const isValidString = (v && v.length > 0) || v > 0;
    return !isValidString;
  });
  consoleDebug(
    "AuthController/registerAuth, invalidTokenValues: ",
    invalidTokenValues
  );
  if (invalidTokenValues.length > 0) {
    apiOk(context, { body: customBody(noResult, noResultStatus) });
    return;
  }

  // assume code is ok
  apiRedirect(context, {
    location: "http://localhost:8030/setup/google?result=setup_success",
    body: customBody(noResult, noResultStatus),
  });
  await next();
};

export const verifyIdToken = async (context: Context, next: Next) => {
  const jsonConfig = await readGoogleConfig();
  const jsonCreds = await readGoogleCreds();
  if (jsonConfig === null || jsonCreds === null) {
    apiOk(context, { body: customBody({ action: "not verified" }, "BLANK") });
    return;
  }
  const clientId = jsonConfig.clientId;
  const clientSecret = jsonConfig.clientSecret;
  const redirectUri = jsonConfig.redirectUris;
  const oAuth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );
  const tokenValid = { action: "Token valid" };
  const tokenExpired = { action: "Token invalid" };
  consoleDebug(
    "AuthController:verifyToken, access_token",
    jsonCreds.accessToken
  );
  try {
    const resp = await oAuth2Client.getTokenInfo(
      jsonCreds.accessToken as string
    );
    consoleDebug("AuthController:verifyToken, payload, ", resp);

    const isValidResp = resp?.email && resp?.email_verified;
    if (!isValidResp) {
      apiBad(context, { body: customBody(tokenExpired, "BLANK") });
      return;
    }
    apiOk(context, {
      body: customBody({
        ...tokenValid,
        email: resp.email,
        emailVerified: resp.email_verified,
        accessType: resp.access_type,
        expiryDate: resp.user_id,
      }),
    });

    await next();
  } catch (error) {
    consoleError("AuthController:verifyToken, ", error);
    apiUnauth(context, { body: customBody(tokenExpired, "BLANK") });
  }
};

export const refreshAccessToken = async (context: Context, next: Next) => {
  const resp = await refreshGoogleCreds();
  if (resp === null) {
    apiOk(context, {
      body: customBody({ action: "not refreshed" }, "BLANK"),
    });
    return;
  }

  apiOk(context, { body: customBody({ action: "refreshed" }) });
  await next();
};

export const verifyAndRefreshToken = async (context: Context, next: Next) => {
  await verifyIdToken(context, next);
  const isTokenInvalid = context.response?.status === 401;
  if (isTokenInvalid) {
    await refreshAccessToken(context, next);
  }
};

export const getUserDetails = async (context: Context, next: Next) => {
  const noResult = customBody({ action: "not user details found" }, "BLANK");
  const json = await readGoogleCreds();
  consoleDebug("tracing getUserDetails, json: ", json);
  if (json === null) {
    apiOk(context, { body: noResult });
    return;
  }

  const userDetails = await googleUserDetails(
    json.idToken as string,
    json.accessToken as string
  );
  consoleDebug("tracing getUserDetails, userDetails: ", userDetails);

  if (userDetails === null) {
    apiOk(context, { body: noResult });
    return;
  }

  apiOk(context, { body: customBody({ userDetails }) });
  await next();
};

/* TODO: retry sendMail using nodemailer
export const sendMail2 = async (ctx: Context, next: Next) => {
  const json = await readJson("google_client_config.json");
  const clientId = json.client_id;
  const clientSecret = json.client_secret;
  const redirectUri = json.redirect_uris[0];
  const oAuth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

  oAuth2Client.verifyIdToken(idToken)


  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: "",
      clientId,
      clientSecret,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });
};
*/

/*
const generateConfig = (url: any, accessToken: any) => {
  return {
    method: "get",
    url: url,
    headers: {
      Authorization: `Bearer ${accessToken} `,
      "Content-type": "application/json",
    },
  };
};
*/

/*
export const sendMail = (ctx: Context, next: Next) => {
  console.log("testing 123");
  const transport = nodemailer.createTransport({
    // service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      type: "OAuth2",
      user: "kahshiu@gmail.com", //your gmail account you used to set the project up in google cloud console"
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      refreshToken,
      accessToken,
    },
  });
  const mailOptions = {
    from: "kahshiu@gmail.com", // sender
    to: "kahshiu@gmail.com", // receiver
    subject: "My tutorial brought me here", // Subject
    html: "<p>You have received this email using nodemailer, you are welcome ;)</p>", // html body
  };
  transport.sendMail(mailOptions, function (error, result) {
    if (error) {
      console.log(error);
      // HTTP.OkResponse(ctx, { payload: HTTPPayload(result) });
    } else {
      transport.close();
      const result = {
        message: "Email has been sent: check your inbox!",
      };
      HTTP.OkResponse(ctx, { payload: HTTPPayload(result) });
    }
  });
};
*/
