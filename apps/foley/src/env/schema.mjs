/* eslint-disable @typescript-eslint/ban-ts-comment */
import { z } from "zod";

export const upstashScheme = z.object({
    REDIS_URL: z.string(),
    UPSTASH_REDIS_REST_URL: z.string(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),
});

export const githubScheme = z.object({
    GITHUB_ID: z.string(),
    GITHUB_SECRET: z.string(),
});

export const discordScheme = z.object({
    DISCORD_ID: z.string(),
    DISCORD_SECRET: z.string(),
});

export const twitterScheme = z.object({
    TWITTER_ID: z.string(),
    TWITTER_SECRET: z.string(),
});

export const nextAuthScheme = z.object({
    NEXTAUTH_URL: z.string().optional(),
    NEXTAUTH_SECRET: z.string(),
});

export const serverScheme = z
    .object({
        HOST: z.string(),
        DATABASE_URL: z.string(),
        SHADOW_DATABASE_URL: z.string(),
    })
    .merge(twitterScheme.partial())
    .merge(nextAuthScheme)
    .merge(githubScheme)
    .merge(upstashScheme);

export const clientScheme = z.object({});

// @ts-ignore : ZodFormattedError<Map<string, string>>
export const formatErrors = (errors) => Object.entries(errors).map(([name, value]) => {
    if ("_errors" in value) return `${name}: ${value._errors.join(", ")}\n`;
    return "";
}).filter(Boolean);
