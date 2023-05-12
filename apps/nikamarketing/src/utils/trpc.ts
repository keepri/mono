import { QueryClient } from "@tanstack/solid-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCSolidStart } from "solid-trpc";
import { type AppRouter } from "~/server/trpc/router/_app";

export const TRPC_BASE_PATHNAME = "/api/trpc" as const;

const getBaseUrl = () => {
    if (typeof window !== "undefined") return "";
    if (process.env.NODE_ENV === "production") return `https://nikamarketing.vercel.app${TRPC_BASE_PATHNAME}`;
    return `http://localhost:3000${TRPC_BASE_PATHNAME}`;
};

export const trpc = createTRPCSolidStart<AppRouter>({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    config(_event) {
        return {
            links: [loggerLink(), httpBatchLink({ url: getBaseUrl() })],
        };
    },
});

export const queryClient = new QueryClient();
