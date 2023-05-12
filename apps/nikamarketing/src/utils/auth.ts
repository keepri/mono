import { type Adapter } from "@auth/core/adapters";
import { getSession, type SolidAuthConfig } from "@auth/solid-start";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { createServerData$ } from "solid-start/server";
import { serverEnv } from "~/env/server";
import { prisma } from "~/server/db/client";

export const authOpts: SolidAuthConfig = {
    callbacks: {
        signIn() {
            const isAllowedToSignIn = !void 0;
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (!isAllowedToSignIn) return false;
            return true;
        },
        session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
            }

            return session;
        },
    },
    adapter: PrismaAdapter(prisma) as Adapter,
    providers: [
        // GitHub({
        //     clientId: serverEnv.GITHUB_ID,
        //     clientSecret: serverEnv.GITHUB_SECRET
        // }),
        // Discord({
        //     clientId: serverEnv.DISCORD_ID,
        //     clientSecret: serverEnv.DISCORD_SECRET,
        // }),
    ],
    session: {
        strategy: "database",
        generateSessionToken: () => crypto.randomUUID(),
    },
    debug: serverEnv.NODE_ENV !== "production",
};

export function useSession() {
    return createServerData$(async (_, event) => getSession(event.request, authOpts), { key: () => "auth_user" });
}
