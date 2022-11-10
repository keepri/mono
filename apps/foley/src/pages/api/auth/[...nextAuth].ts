import { prisma, PrismaAdapter } from '@clfxc/db';
import NextAuth, { Session } from 'next-auth';

export type NextSession = Session & { userId: string };

export default NextAuth({
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	adapter: PrismaAdapter(prisma),
	providers: [],
	callbacks: {
		session: async ({ session, user }) => {
			const updatedSession: NextSession = { ...session, userId: user.id };
			return Promise.resolve(updatedSession);
		},
	},
});
