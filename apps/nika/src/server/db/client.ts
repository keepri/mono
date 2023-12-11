import { isServer } from "solid-js/web";
import { serverEnv } from "~/env/server";
import { PrismaClient } from "~/../prisma/.client";

declare global {
    // eslint-disable-next-line no-var, vars-on-top
    var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma ?? new PrismaClient({ log: ["query", "error", "warn"] });

if (isServer && serverEnv.NODE_ENV !== "production") {
    global.prisma = prisma;
}
