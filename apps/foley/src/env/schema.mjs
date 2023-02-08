/* eslint-disable @typescript-eslint/ban-ts-comment */
import { z } from "zod";

export const upstashScheme = z.object({
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

export const serverScheme = z
    .object({
        NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
        ENABLE_VC_BUILD: z
            .string()
            .default("1")
            .transform((v) => parseInt(v, 10)),
        DISCORD_ID: z.string().optional(),
        DISCORD_SECRET: z.string().optional(),
        AUTH_SECRET: z.string(),
        AUTH_TRUST_HOST: z.string().optional(),
        AUTH_URL: z.string().optional(),
        DATABASE_URL: z.string(),
    })
    // TODO: remove .partial() if using service
    // .merge(githubScheme)
    // .merge(discordScheme)
    .merge(upstashScheme.partial());

export const clientScheme = z.object({
    MODE: z.enum(["development", "production", "test"]).default("development"),
});

// : ZodFormattedError<Map<string, string>>
// @ts-ignore
export const formatErrors = (errors) =>
    Object.entries(errors)
        .map(([name, value]) => {
            if ("_errors" in value) return `${name}: ${value._errors.join(", ")}\n`;
            return "";
        })
        .filter(Boolean);
