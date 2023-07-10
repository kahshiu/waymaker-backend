import { Context, Next, Router } from "oak/mod.ts";
import { HTTP } from "../helpers/HTTP.ts";
import { HTTPPayload } from "../helpers/HTTPPayload.ts";
// // @deno-types="npm:@types/nodemailer@6.4.8"
import nodemailer from "nodemailer";
import MailComposer from "mailcomposer";

import googleapis, { google } from "npm:googleapis@120.0.0";
import { LogConsole } from "../middleware/logger/LogHelpers.ts";
import { readJson, writeJson } from "../helpers/json.ts";
import {
  getGoogleConfig,
  refreshGoogleCredsRaw,
  tokenDtoToEntity,
  writeGoogleCredsRaw,
} from "../helpers/authGoogle.ts";
import * as _ from "lodash";

import { encode, decode } from "https://deno.land/std/encoding/base64url.ts";

const withBasePath = (path: string) => `/auth/${path}`;

export const routeOAuth = (router: Router) => {
  router.get(withBasePath("google/register"), registerOAuth);
  router.get(withBasePath("google/refresh"), refreshOAuth);
  router.get(withBasePath("google/verify"), verifyIdToken);
  router.get(withBasePath("mail/send"), sendMail2);
  router.get(withBasePath("userDetails"), getUserDetails);
};

export const registerOAuth = async (ctx: Context, next: Next) => {
  const url = new URL(ctx.request.url);
  const obj = new URLSearchParams(url.search);
  const code = obj.get("code");

  let result = { action: "not credentials were written" };

  if (code) {
    // const tokens = await writeGoogleCreds(code as string);
    const tokens = await writeGoogleCredsRaw(code as string);
    const filtered = Object.values(tokens).filter((v) => !(v && v.length > 0));
    if (filtered.length > 0) {
      result = { action: "written google credentials" };
    }
  }

  HTTP.OkResponse(ctx, { payload: HTTPPayload(result) });
  await next();
};

export const getUserDetails = async (ctx: Context, next: Next) => {
  const json = await readJson("google_creds.json");
  const userDetails = await googleUserDetails(json.idToken, json.accessToken);
  LogConsole.debug("tracing getUserDetails, userDetails: ", userDetails);

  const result = userDetails;
  HTTP.OkResponse(ctx, { payload: HTTPPayload(result) });
  await next();
};

// TODO: check resp status before json
export const googleUserDetails = async (
  idToken: string,
  accessToken: string
) => {
  const apiUri = "https://www.googleapis.com/oauth2/v1/userinfo";
  const qsObj = new URLSearchParams({
    alt: "json",
    access_token: accessToken,
  });
  const headerObj = {
    Authorization: "Bearer " + idToken,
  };
  const url = `${apiUri}?${qsObj.toString()}`;
  LogConsole.debug("tracing googleUserDetails: ", url);

  const resp = await fetch(url, {
    method: "GET",
    headers: headerObj,
  });
  return await resp.json();
};

export const refreshOAuth = async (ctx: Context, next: Next) => {
  await refreshGoogleCredsRaw();

  const result = { action: "refreshed access_token" };
  HTTP.OkResponse(ctx, { payload: HTTPPayload(result) });
  await next();
};

const getGmailService = async () => {
  const config = await getGoogleConfig();
  const oAuth2Client = new google.auth.OAuth2(
    config.clientId,
    config.clientSecret,
    config.redirectUris[0]
  );

  const json = await readJson("google_creds.json");
  oAuth2Client.setCredentials(tokenDtoToEntity(json));
  const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
  return gmail;
};

const encodeMessage = (message: any) => {
  return encode(message);
  /*
  return new Buffer(message)
    .toString()
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
    */
};

const createMail = async (options: any) => {
  const mailComposer = new MailComposer(options);
  const message = await mailComposer.compile().build();
  return encodeMessage(message);
};

const sendGMail = async (options: any) => {
  const gmail = await getGmailService();
  console.log("tracing sendGmail: ", "got the mail service");
  const rawMessage = await createMail(options);
  console.log("tracing sendGmail: ", "created mail");
  const { data: { id } = {} } = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: rawMessage,
    },
  });
  console.log("tracing sendGmail: ", "sent mail");
  return id;
};

export const sendMail = async (ctx: Context, next: Next) => {
  const options = {
    to: "kahshiu@gmail.com",
    cc: "kahshiu@gmail.com",
    // replyTo: 'amit@labnol.org',
    subject: "Hello Amit",
    text: "This email is sent from the command line",
    html: `<p>This is a <b>test email</b> from <a href="https://digitalinspiration.com">Digital Inspiration</a>.</p>`,
    textEncoding: "base64",
    headers: [
      { key: "X-Application-Developer", value: "Amit Agarwal" },
      { key: "X-Application-Version", value: "v1.0.0.2" },
    ],
  };

  const messageId = await sendGMail(options);
  console.log(messageId);
};

export const verifyIdToken = async (ctx: Context, next: Next) => {
  const json = await readJson("google_client_config.json");
  const json2 = await readJson("google_creds.json");
  const clientId = json.web.client_id;
  const clientSecret = json.web.client_secret;
  const redirectUri = json.web.redirect_uris;
  const oAuth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );
  // const x = tokenDtoToEntity(json2);
  console.log(json2.accessToken);
  let resp;
  try {
    resp = await oAuth2Client.getTokenInfo(json2.accessToken);
    LogConsole.debug("tracing envelop, payload, ", resp);
  } catch (error) {
    console.log("tracing error", error);
  }
};
export const sendMail2 = async (ctx: Context, next: Next) => {
  /*
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
  */
};
/*
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
