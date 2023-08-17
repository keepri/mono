import { PrismaAdapter, prisma } from "db";
import { serverEnv } from "@env/server.mjs";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { RoleName } from "@utils/enums";
import { RoleManager } from "@utils/helpers";

export default NextAuth({
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
        async signIn(params) {
            try {
                RoleManager.assign(+params.user.id, RoleName.user);

                return true;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch ({ message }: any) {
                console.error("sign in callback", message);
                return "failed signing in";
            }
        },
    },
});
