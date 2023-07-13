import { Context, Next, Router } from "oak/mod.ts";
import { google } from "googleapis";
import { tokenDtoToEntity } from "#db/models/GoogleTokenDto.ts";
import { readGoogleConfig, readGoogleCreds } from "#services/AuthGoogle.ts";
import { sendGMail } from "#services/MailService.ts";
import { customBody, apiBad, apiOk } from "#util/HTTP.ts";

const withBasePath = (path: string) => `/mail/${path}`;

export const routeMail = (router: Router) => {
  router.get(withBasePath("send"), withGmailService, sendMail);
};
const withGmailService = async (context: Context, next: Next) => {
  const config = await readGoogleConfig();
  const creds = await readGoogleCreds();
  if (config === null || creds === null) {
    const noGmailService = customBody({ action: "No Gmail service" }, "BLANK");
    apiBad(context, { body: noGmailService });
    return;
  }
  const oAuth2Client = new google.auth.OAuth2(
    config.clientId,
    config.clientSecret,
    config.redirectUris[0]
  );

  oAuth2Client.setCredentials(tokenDtoToEntity(creds));
  context.state.gmailService = google.gmail({
    version: "v1",
    auth: oAuth2Client,
  });
  await next();
};

const sendMail = async (context: Context, next: Next) => {
  const gmailService = context.state.gmailService;
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

  const messageId = await sendGMail(gmailService, options);

  apiOk(context, { body: customBody({ messageId }) });
};
