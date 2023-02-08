/* eslint-disable @typescript-eslint/ban-ts-comment */
import { clientScheme, formatErrors } from "./schema.mjs";

// @ts-ignore
const env = clientScheme.safeParse(import.meta.env);

if (!env.success) {
    console.error("❌ Invalid environment variables:\n", ...formatErrors(env.error.format()));
    throw new Error("Invalid environment variables");
}

export const clientEnv = env.data;
