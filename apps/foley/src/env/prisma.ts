import { Prisma, PrismaClient } from '@clfxc/db';

let prisma: PrismaClient;

const config: Prisma.Subset<Prisma.PrismaClientOptions, Prisma.PrismaClientOptions> = {
	log: ['query', 'error'],
};

if (process.env.NODE_ENV === 'production') {
	prisma = new PrismaClient(config);
} else {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	if (!(global as any).prisma) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(global as any).prisma = new PrismaClient(config);
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	prisma = (global as any).prisma;
}

export default prisma as PrismaClient;
