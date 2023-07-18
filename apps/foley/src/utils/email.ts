import { type SendSmtpEmail, TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@sendinblue/client";
import { serverEnv } from "@env/server.mjs";

export type Email =
    Omit<SendSmtpEmail, "sender"> &
    (Required<Pick<SendSmtpEmail, "to" | "subject" | "htmlContent">> | Required<Pick<SendSmtpEmail, "to" | "subject" | "textContent">>);

const emailApi = new TransactionalEmailsApi();
emailApi.setApiKey(TransactionalEmailsApiApiKeys.apiKey, serverEnv.SENDINBLUE_API_KEY);

export async function sendEmail(email: Email) {
    let emails = "";

    for (let index = 0; index < email.to.length; index++) {
        emails += `${index + 1}(${email.to[index].name ?? "email"}: ${email.to[index].email}), `;
    }

    emails = emails.trim().slice(0, emails.length - 1);

    try {
        const result = await emailApi.sendTransacEmail(
            Object.assign(email, {
                sender: {
                    name: "KIPRI.dev - Fullstack Web Dev",
                    email: serverEnv.CONTACT_EMAIL,
                },
            } satisfies SendSmtpEmail)
        );

        const id = result.body.messageIds ?? result.body.messageId;

        console.log(
            "successfully sent email to:",
            emails,
            "status code:",
            result.response.statusCode,
            "status message:",
            result.response.statusMessage,
            "message ids:",
            typeof id === "string" ?
                id :
                typeof id === "object" ?
                    id.join(", ").trim() :
                    "no ids"
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch ({ message }: any) {
        console.error("could not send email to:", emails);
        throw new Error(message);
    }
}
