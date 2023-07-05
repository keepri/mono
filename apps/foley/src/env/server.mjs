import { formatErrors, serverScheme } from "./schema.mjs";

const env = serverScheme.safeParse(process.env);

if (!env.success) {
    console.error("❌ Invalid environment variables:\n", ...formatErrors(env.error.format()));
    throw new Error("Invalid environment variables");
}

export const serverEnv = env.data;
