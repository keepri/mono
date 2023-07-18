import { isServer } from "solid-js/web";
import { type ClientScheme, clientScheme, formatErrors } from "./schema";

const env = clientScheme.safeParse(process.env);

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (!isServer && !env.success) {
    console.error("❌ Invalid environment variables:\n", ...formatErrors(env.error.format()));
    throw new Error("Invalid environment variables");
}

//  @ts-expect-error xD!
export const clientEnv: ClientScheme = env.data;
