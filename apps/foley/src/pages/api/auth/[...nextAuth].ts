import { prisma, PrismaAdapter } from "@clfxc/db";
import NextAuth, { Session } from "next-auth";

export type NextSession = Session & { userId: string };

export default NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [],
    callbacks: {
        session: async ({ session, user }) => {
            const updatedSession: NextSession = { ...session, userId: user.id };
            return Promise.resolve(updatedSession);
        },
    },
});
