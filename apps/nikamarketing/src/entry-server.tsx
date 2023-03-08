import { type JSXElement } from "solid-js";
import { redirect } from "solid-start";
import { createHandler, renderAsync, StartServer } from "solid-start/entry-server";
import { useSession } from "./utils/auth";

export enum Routes {
    HOME = "/",
    SIGN_IN = "/sign-in",

    //  API
    API_AUTH = "/api/auth",
    API_TRPC = "/api/trpc",
}

// make as const
const PROTECTED_ROUTES: string[] = [];

export default createHandler(
    (input) => {
        return async (event) => {
            if (PROTECTED_ROUTES.includes(new URL(event.request.url).pathname)) {
                const session = useSession();
                if (!session.latest?.user) {
                    return redirect(Routes.SIGN_IN);
                }
            }

            return input.forward(event);
        };
    },
    renderAsync((event): JSXElement => <StartServer event={event} />)
);
