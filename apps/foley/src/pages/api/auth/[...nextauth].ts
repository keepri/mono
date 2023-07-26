import { prisma, PrismaAdapter } from "db";
import { serverEnv } from "@env/server.mjs";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export default NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        GitHub({
            clientId: serverEnv.GITHUB_ID,
            clientSecret: serverEnv.GITHUB_SECRET,
            profile: function githubProfile(profile) {
                profile.role = profile.id === 10146439 ? "admin" : "user";

                return profile;
            },
        }),
    ],
    callbacks: {
        session: function sessionCallback({ session, user }) {
            if (session.user) {
                session.user.id = Number(user.id);
                session.user.role = user.role;
            }

            return session;
        },
    },
});
