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

const PROTECTED_ROUTES: Set<Routes> = new Set<Routes>([]);

export default createHandler(
    (input) => {
        return async (event) => {
            if (PROTECTED_ROUTES.has(new URL(event.request.url).pathname as Routes)) {
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
