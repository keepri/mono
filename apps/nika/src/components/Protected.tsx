import { type Session } from "@auth/core/types";
import { Show, type Component } from "solid-js";
import { useRouteData } from "solid-start";
import { redirect } from "solid-start/server";
import { useSession } from "~/utils/auth";
import { Routes } from "~/entry-server";

const routeDataSession = () => {
    const session = useSession();

    if (!session()?.user) {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw redirect(Routes.HOME);
    }

    return session;
};

type ProtectedComponent = Component<Session>;

export default function Protected(Component: ProtectedComponent) {
    return {
        routeData: routeDataSession,
        Page: () => {
            const session = useRouteData<typeof routeDataSession>();

            return (
                <Show when={session()} keyed>
                    {(sess) => <Component {...sess} />}
                </Show>
            );
        },
    };
}
