import { QueryClient } from "@tanstack/solid-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCSolid } from "solid-trpc";
import { type AppRouter } from "~/server/trpc/router/_app";

export const BASE_TRPC_PATHNAME = "/api/trpc" as const;

const getBaseUrl = () => {
    if (typeof window !== "undefined") return "";
    if (process.env.NODE_ENV === "production") return `https://nikamarketing.vercel.app${BASE_TRPC_PATHNAME}`;
    return `http://localhost:3000${BASE_TRPC_PATHNAME}`;
};

export const trpc = createTRPCSolid<AppRouter>();

export const client = trpc.createClient({
    links: [loggerLink(), httpBatchLink({ url: getBaseUrl() })],
});

export const queryClient = new QueryClient();
