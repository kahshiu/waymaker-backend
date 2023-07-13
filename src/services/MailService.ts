import { encode } from "$std/encoding/base64url.ts";
import MailComposer from "mailcomposer";
import googleapis from "googleapis";
import { consoleDebug } from "#util/Console.ts";

const createEncodedMail = async (options: any) => {
  const mailComposer = new MailComposer(options);
  const message = await mailComposer.compile().build();
  return encode(message);
};

export const sendGMail = async (
  gmailService: googleapis.gmail_v1.Gmail,
  options: any
) => {
  const rawMessage = await createEncodedMail(options);
  consoleDebug("sendEmail, created mail", "");

  const { data: { id } = {} } = await gmailService.users.messages.send({
    userId: "me",
    requestBody: {
      raw: rawMessage,
    },
  });
  consoleDebug("sendEmail, sent mail", "");
  return id;
};
