import { PrismaAdapter, prisma } from "db";
import { serverEnv } from "@env/server.mjs";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { RoleManager } from "@utils/helpers";
import { RoleName } from "@utils/enums";

export default NextAuth({
    events: {
        async createUser(params) {

            await RoleManager.assign(+params.user.id, RoleName.user);
        },
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        GitHub({
            clientId: serverEnv.GITHUB_ID,
            clientSecret: serverEnv.GITHUB_SECRET,
        }),
    ],
    callbacks: {
        session(params) {
            if (params.session.user) {
                params.session.user.id = +params.user.id; // this is actually a number but the types are annoying
            }

            return params.session;
        },
        async signIn() {
            try {
                return true;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch ({ message }: any) {
                console.error("sign in callback", message);
                return "failed signing in";
            }
        },
    },
});
