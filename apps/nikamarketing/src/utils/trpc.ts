import { QueryClient } from "@adeora/solid-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { isServer } from "solid-js/web";
import { createTRPCSolidStart } from "solid-trpc";
import { type AppRouter } from "~/server/trpc/router/_app";

export const BASE_TRPC_PATHNAME = "/api/trpc" as const;

const getBaseUrl = () => {
    if (typeof window !== "undefined") return "";
    if (process.env.NODE_ENV === "production") return `https://nikamarketing.vercel.app${BASE_TRPC_PATHNAME}`;
    return `http://localhost:3000${BASE_TRPC_PATHNAME}`;
};

export const trpc = createTRPCSolidStart<AppRouter>({
    config(event) {
        return {
            links: [
                loggerLink(),
                httpBatchLink({
                    url: getBaseUrl(),
                    headers: () => {
                        if (isServer && event?.request) {
                            // do something
                        }
                        return {};
                    },
                }),
            ],
        };
    },
});

export const queryClient = new QueryClient();
