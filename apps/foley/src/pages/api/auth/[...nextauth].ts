import { PrismaAdapter, prisma } from "db";
import { serverEnv } from "@env/server.mjs";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export default NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        GitHub({
            clientId: serverEnv.GITHUB_ID,
            clientSecret: serverEnv.GITHUB_SECRET,
        }),
    ],
    callbacks: {
        session({ session, user }) {
            if (session.user) {
                session.user.id = user.id as unknown as number; // this is actually a number but the types are annoying
            }

            return session;
        },
    },
});
