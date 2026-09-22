import { prisma } from "db";
import { type NextApiRequest, type NextApiResponse } from "next";
import { generateErrorMessage } from "zod-error";
import { sendEmail } from "@utils/email";
import { serverEnv } from "@env/server.mjs";
import { ContactBodySchema } from "@utils/schemas";
import { validateSession$ } from "@utils/helpers";
import {
    getDuplicateRateKey,
    getEmailRateKey,
    isAllowedOrigin,
} from "@utils/contactRateLimit";
import { makeRateLimitHeaders } from "@utils/rateLimit";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";

const contactEmailRateLimitPer2h = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(1, "2 h"),
    prefix: "contact-email-2h",
});
const contactEmailRateLimitPerDay = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(2, "24 h"),
    prefix: "contact-email-24h",
});
const contactDuplicateRateLimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(1, "7 d"),
    prefix: "contact-duplicate-7d",
});

const ContactSubmitSchema = ContactBodySchema.omit({ userId: true }).extend({
    website: z.string().max(255).optional().default(""),
    startedAt: z.number().int().nonnegative(),
});

const minSubmitAgeMs = 5000;

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        return res.status(405).send("unsupported method");
    }

    try {
        const body = ContactSubmitSchema.safeParse(req.body);

        if (!body.success) {
            return res
                .status(400)
                .send(generateErrorMessage(body.error.issues));
        }

        if (!isAllowedOrigin(req, serverEnv.HOST)) {
            console.warn("contact blocked: origin", req.headers.origin);
            return res.status(429).send("Too many requests. Try again later.");
        }

        if (body.data.website.trim().length > 0) {
            console.warn("contact blocked: honeypot");
            return res.status(429).send("Too many requests. Try again later.");
        }

        const submitAgeMs = Date.now() - body.data.startedAt;
        if (submitAgeMs < minSubmitAgeMs) {
            console.warn("contact blocked: too_fast");
            return res.status(429).send("Too many requests. Try again later.");
        }

        const session = await validateSession$(req.headers);

        const emailRateKey = getEmailRateKey(body.data.email);
        const duplicateRateKey = getDuplicateRateKey(
            body.data.email,
            body.data.message
        );

        let checks:
            | Awaited<ReturnType<typeof contactEmailRateLimitPer2h.limit>>[]
            | undefined;

        try {
            checks = await Promise.all([
                contactEmailRateLimitPer2h.limit(emailRateKey),
                contactEmailRateLimitPerDay.limit(emailRateKey),
                contactDuplicateRateLimit.limit(duplicateRateKey),
            ]);

            await Promise.all(checks.map((check) => check.pending));
        } catch {
            if (!session?.userId) {
                console.warn("contact limiter outage: block-anonymous");
                return res.status(429).send("Too many requests. Try again later.");
            }

            console.warn("contact limiter outage: fail-open-authenticated");
        }

        const failedCheck = checks?.find((check) => !check.success);

        if (failedCheck) {
            console.warn("contact blocked: rate_limit");
            return sendRateLimit429(
                res,
                failedCheck.limit,
                failedCheck.remaining,
                failedCheck.reset
            );
        }

        const contact = await prisma.contact.create({
            data: {
                name: body.data.name,
                email: body.data.email,
                message: body.data.message,
                userId: session?.userId,
            },
        });

        console.log(
            "successfully saved contact form",
            contact.id,
            "from",
            contact.email,
            "on",
            contact.createdAt
        );

        const user = session?.userId
            ? await prisma.user.findFirst({
                where: { id: { equals: session.userId } },
            })
            : null;

        await sendEmail({
            to: [{ name: "KIPRI.dev", email: serverEnv.CONTACT_EMAIL }],
            subject: "New contact form submission",
            textContent: `
                Name: ${body.data.name ?? "none"}
                Email: ${body.data.email}
                Message: ${body.data.message}
                
                ${
                    user
                        ? `User name & id: ${user.name ?? "missing name"} - ${
                            user.id
                        }`
                        : "User not logged in"
}
                Date: ${contact.createdAt.toLocaleString()}
                DatabaseId: ${contact.id}
            `,
        });

        return res.status(200).send("done");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch ({ stack, message }: any) {
        console.error("contact endpoint fail stack:", stack);
        console.error("contact endpoint fail message:", message);

        return res.status(500).send(message);
    }
};

function sendRateLimit429(
    res: NextApiResponse,
    limit: number,
    remaining: number,
    reset: number
) {
    const headers = makeRateLimitHeaders(limit, remaining, reset);
    for (const [key, value] of Object.entries(headers)) {
        res.setHeader(key, value);
    }

    return res.status(429).send("Too many requests. Try again later.");
}
