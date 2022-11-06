import { PrismaAdapter } from '@clfxc/db';
import prisma from '@env/prisma';
import NextAuth, { Session } from 'next-auth';

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
