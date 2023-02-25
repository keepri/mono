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
        // NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
        ENABLE_VC_BUILD: z
            .string()
            .default("1")
            .transform((v) => parseInt(v, 10)),
        AUTH_SECRET: z.string(),
        AUTH_TRUST_HOST: z.string().optional(),
        AUTH_URL: z.string().optional(),
        NEXTAUTH_URL: z.string(),
        DATABASE_URL: z.string(),
    })
    // .merge(discordScheme)
    .merge(githubScheme)
    .merge(upstashScheme);

export const clientScheme = z.object({
    MODE: z.enum(["development", "production", "test"]).default("development"),
});

// @ts-ignore : ZodFormattedError<Map<string, string>>
export const formatErrors = (errors) =>
    Object.entries(errors)
        .map(([name, value]) => {
            if ("_errors" in value) return `${name}: ${value._errors.join(", ")}\n`;
            return "";
        })
        .filter(Boolean);
