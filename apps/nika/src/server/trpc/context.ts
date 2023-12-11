import { type createSolidAPIHandlerContext } from "solid-start-trpc";
import { type inferAsyncReturnType } from "@trpc/server";
import { getSession } from "@auth/solid-start";
import { prisma } from "~/server/db/client";
import { authOpts } from "~/utils/auth";

export const createContextInner = async (opts: createSolidAPIHandlerContext) => {
    const session = await getSession(opts.req, authOpts);
    return {
        ...opts,
        prisma,
        session,
    };
};

export const createContext = async (opts: createSolidAPIHandlerContext) => createContextInner(opts);

export type TRPCContext = inferAsyncReturnType<typeof createContext>;
