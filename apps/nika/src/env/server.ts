import { isServer } from "solid-js/web";
import { formatErrors, type ServerScheme, serverScheme } from "./schema";

const env = serverScheme.safeParse(process.env);

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (isServer && !env.success) {
    console.error("❌ Invalid environment variables:\n", ...formatErrors(env.error.format()));
    throw new Error("Invalid environment variables");
}

//  @ts-expect-error xD!
export const serverEnv: ServerScheme = env.data;
