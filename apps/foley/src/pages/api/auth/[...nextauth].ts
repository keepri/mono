import { prisma, PrismaAdapter } from "@clfxc/db";
import { serverEnv } from "@env/server.mjs";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
// import Twitter from "next-auth/providers/twitter";

export default NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        GitHub({
            clientId: serverEnv.GITHUB_ID,
            clientSecret: serverEnv.GITHUB_SECRET,
        }),
        // Twitter({
        //     clientId: serverEnv.TWITTER_ID,
        //     clientSecret: serverEnv.TWITTER_SECRET,
        //     version: "2.0",
        // }),
    ],
    callbacks: {
        session: async ({ session, user }) => {
            if (session.user) {
                const sess = { ...session, user: { ...session.user, id: user.id } };
                return sess;
            }

            return session;
        },
    },
});
