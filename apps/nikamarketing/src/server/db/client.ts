import { PrismaClient } from "@prisma/client";
import { isServer } from "solid-js/web";
import { serverEnv } from "~/env/server";

declare global {
    // eslint-disable-next-line no-var, vars-on-top
    var prisma: PrismaClient | undefined;
}

export const prisma =
    global.prisma ??
    new PrismaClient({
        log: serverEnv.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (serverEnv.NODE_ENV !== "production" && isServer) {
    global.prisma = prisma;
}
