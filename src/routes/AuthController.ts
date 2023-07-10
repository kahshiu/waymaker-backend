import { Context, Next, Router } from "oak/mod.ts";
import { HTTP } from "../helpers/HTTP.ts";
import { HTTPPayload } from "../helpers/HTTPPayload.ts";
// // @deno-types="npm:@types/nodemailer@6.4.8"
import nodemailer from "npm:nodemailer@6.9.3";
// import MailComposer from "npm:nodemailer@6.9.3/lib/mail-composer";

import googleapis, { google } from "npm:googleapis@120.0.0";
import { LogConsole } from "../middleware/logger/LogHelpers.ts";
import { readJson, writeJson } from "../helpers/json.ts";
import { getGoogleConfig, writeGoogleCredsRaw } from "../helpers/authGoogle.ts";
import * as _ from "lodash";

import { Buffer } from "https://deno.land/std/io/buffer.ts";

const withBasePath = (path: string) => `/auth/${path}`;

export const routeOAuth = (router: Router) => {
  router.get(withBasePath("google/register"), registerOAuth);
  router.get(withBasePath("google/refresh"), refreshOAuth);
  router.get(withBasePath("mail/send"), sendMail);
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

const getGmailService = async () => {
  const config = await getGoogleConfig();
  const oAuth2Client = new google.auth.OAuth2(
    config.clientId,
    config.clientSecret,
    config.redirectUris[0]
  );

  const json = await readJson("google_creds.json");
  oAuth2Client.setCredentials(json);
  const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
  return gmail;
};

const encodeMessage = (message: any) => {
  return new Buffer(message)
    .toString()
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

/*
const createMail = async (options: any) => {
  const mailComposer = new MailComposer(options);
  const message = await mailComposer.compile().build();
  return encodeMessage(message);
};

const sendGMail = async (options: any) => {
  const gmail = await getGmailService();
  const rawMessage = await createMail(options);
  // const { data: { id } = {} } = await gmail.users.messages.send({
  //   userId: "me",
  //   resource: {
  //     raw: rawMessage,
  //   },
  // });
  // return id;
  return 123;
};
*/

const options = {
  to: "kahshiu@gmail.com",
  cc: "kahshiu@gmail.com",
  // replyTo: 'amit@labnol.org',
  subject: "Hello Amit 🚀",
  text: "This email is sent from the command line",
  html: `<p>🙋🏻‍♀️  &mdash; This is a <b>test email</b> from <a href="https://digitalinspiration.com">Digital Inspiration</a>.</p>`,
  textEncoding: "base64",
  headers: [
    { key: "X-Application-Developer", value: "Amit Agarwal" },
    { key: "X-Application-Version", value: "v1.0.0.2" },
  ],
};

export const sendMail = async (ctx: Context, next: Next) => {
  const messageId = await sendGMail(options);
};

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
