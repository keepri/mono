/* eslint-disable @typescript-eslint/ban-ts-comment */
import { z } from "zod";

const upstashScheme = z.object({
    REDIS_URL: z.string(),
    UPSTASH_REDIS_REST_URL: z.string(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),
});

const githubScheme = z.object({
    GITHUB_ID: z.string(),
    GITHUB_SECRET: z.string(),
});

const nextAuthScheme = z.object({
    NEXTAUTH_URL: z.string(),
    NEXTAUTH_SECRET: z.string(),
});

// const discordScheme = z.object({
//     DISCORD_ID: z.string(),
//     DISCORD_SECRET: z.string(),
// });
//
// const twitterScheme = z.object({
//     TWITTER_ID: z.string(),
//     TWITTER_SECRET: z.string(),
// });

export const serverScheme = z
    .object({
        HOST: z.string(),
        DATABASE_URL: z.string().min(1),
        SHADOW_DATABASE_URL: z.string().min(1),
        // RESEND_API_KEY: z.string().min(1),
        SENDINBLUE_API_KEY: z.string().min(1),
        CONTACT_EMAIL: z.string().min(1),
    })
    .merge(nextAuthScheme)
    .merge(githubScheme)
    .merge(upstashScheme);

export const clientScheme = z.object({});

// @ts-ignore : ZodFormattedError<Map<string, string>>
export const formatErrors = (errors) => Object.entries(errors).map(([name, value]) => {
    if ("_errors" in value) return `${name}: ${value._errors.join(", ")}\n`;
    return "";
}).filter(Boolean);
