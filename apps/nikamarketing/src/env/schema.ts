import { z, type ZodFormattedError } from "zod";

export const upstashScheme = z.object({
    UPSTASH_REDIS_REST_URL: z.string(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),
});

// export const githubScheme = z.object({
//     GITHUB_ID: z.string(),
//     GITHUB_SECRET: z.string(),
// });

// export const discordScheme = z.object({
//     DISCORD_ID: z.string(),
//     DISCORD_SECRET: z.string(),
// });

export const serverScheme = z
    .object({
        NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
        DISCORD_ID: z.string().optional(),
        DISCORD_SECRET: z.string().optional(),
        AUTH_URL: z.string().optional(),
        AUTH_SECRET: z.string(),
        AUTH_TRUST_HOST: z.string().optional(),
        DATABASE_URL: z.string(),
    })
    // TODO: remove .partial() if using the service
    // .merge(githubScheme)
    // .merge(discordScheme)
    .merge(upstashScheme.partial());

export type ServerScheme = z.infer<typeof serverScheme>;

export const clientScheme = z.object({});

export type ClientScheme = z.infer<typeof clientScheme>;

export const formatErrors = (errors: ZodFormattedError<Map<string, string>>) =>
    Object.entries(errors)
        .map(([name, value]) => {
            if ("_errors" in value) return `${name}: ${value._errors.join(", ")}\n`;
            return "";
        })
        .filter(Boolean);
