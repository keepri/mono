import { sendEmail, type Email } from "@utils/email";
import { validateSession$, RoleManager } from "@utils/helpers";
import { z } from "zod";
import { type NextApiRequest, type NextApiResponse } from "next/types";
import { generateErrorMessage } from "zod-error";

const IdentitySchema = z.array(z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().min(1),
})).min(1);

export const EmailSchema = z.object({
    sender: IdentitySchema,
    subject: z.string().min(1),
    to: IdentitySchema,
    cc: IdentitySchema.optional(),
    bcc: IdentitySchema.optional(),
    tags: z.array(z.string().min(1)).min(1).optional(),
    replyTo: IdentitySchema.optional(),
    attachment: z.array(z.object({
        url: z.string().url().min(1).optional(),
        content: z.string().min(1).optional(),
        name: z.string().min(1).optional(),
    })).min(1).optional(),
    batchId: z.string().min(1).optional(),
    templateId: z.number().nonnegative().optional(),
    scheduledAt: z.string().min(1).optional(),
}).and(z.object({
    textContent: z.string().min(1)
}).or(z.object({
    htmlContent: z.string().min(1)
})));

const BodySchema = EmailSchema;

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        return res.status(405).send("unsupported method");
    }

    try {
        const body = BodySchema.safeParse(req.body);

        if (!body.success) {
            return res.status(400).send(generateErrorMessage(body.error.issues));
        }

        // always exists because of middleware
        const session = await validateSession$(req.headers);

        if (!(await RoleManager.isAdmin(session!.userId))) {
            throw {
                status: 403,
                message: "insufficient access rights",
            };
        }

        await sendEmail(body.data as Email);

        return res.status(200).send("done");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch ({ stack, message, status, statusCode }: any) {
        stack && console.error("send email endpoint fail stack:", stack);
        console.error("send email endpoint fail message:", message);

        return res.status(status ?? statusCode ?? 500).send(message);
    }
};

// Next api config
export const config = {
    api: {
        bodyParser: {
            sizeLimit: "3500kb",
        },
    },
};
