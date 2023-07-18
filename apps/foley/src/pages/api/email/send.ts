import { sendEmail, type Email } from "@utils/email";
import { prisma } from "db";
import { validateSessionApiRequest } from "@utils/helpers";
import { z } from "zod";
import { type NextApiRequest, type NextApiResponse } from "next/types";
import { type IncomingHttpHeaders } from "http2";
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

        await userIsAdmin(req.headers);
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

async function userIsAdmin(headers: IncomingHttpHeaders): Promise<void> {
    const session = await validateSessionApiRequest(headers);

    if (!session) {
        // this should never happen because of middleware
        throw {
            status: 401,
            message: "please sign in",
        };
    }

    const user = await prisma.user.findFirst({ where: { id: { equals: session.userId } } });

    if (!user) {
        throw {
            status: 404,
            message: "user not found",
        };
    }

    if (user.role !== "admin") {
        throw {
            status: 403,
            message: "insufficient access rights",
        };
    }

    return void 0;
}
