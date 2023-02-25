import { prisma, PrismaAdapter } from "@clfxc/db";
import { serverEnv } from "@env/server.mjs";
import NextAuth, { Session } from "next-auth";
import GitHub from "next-auth/providers/github";
// import Twitter from "next-auth/providers/twitter";

export type NextSession = Session & { userId: string };

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
            const updatedSession: NextSession = { ...session, userId: user.id };
            return updatedSession;
        },
    },
});
