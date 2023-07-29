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
                session.user.id = +user.id; // this is actually a number but the types are annoying
            }

            return session;
        },
        async signIn(params) {
            const userRole = await prisma.user_role.findFirst({ where: { userId: +params.user.id } });

            if (!userRole) {
                const role = await prisma.role.findFirst({ where: { name: "user" } });
                await prisma.user_role.create({ data: { userId: +params.user.id, roleId: role!.id } });
                console.log(`set user ${params.user.id} the role of "user"`);
            }

            return true;
        },
    },
});
