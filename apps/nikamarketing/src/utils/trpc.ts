import { QueryClient } from "@adeora/solid-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCSolidStart } from "solid-trpc";
import { type AppRouter } from "~/server/trpc/router/_app";

export const BASE_TRPC_PATHNAME = "/api/trpc" as const;

const getBaseUrl = () => {
    if (typeof window !== "undefined") return "";
    // TODO PROD: replace example.com with your actual production url
    if (process.env.NODE_ENV === "production") return `https://example.vercel.app${BASE_TRPC_PATHNAME}`;
    return `http://localhost:3000${BASE_TRPC_PATHNAME}`;
};

export const trpc = createTRPCSolidStart<AppRouter>({
    config() {
        return {
            links: [loggerLink(), httpBatchLink({ url: getBaseUrl() })],
        };
    },
});

export const queryClient = new QueryClient();
