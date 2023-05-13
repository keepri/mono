import solid from "solid-start/vite";
import prpc from "@prpc/vite";
import { defineConfig } from "vite";
import vercel from "solid-start-vercel";

export default defineConfig(() => ({
    plugins: [prpc(), solid({ ssr: true, adapter: vercel({ edge: false }) })],
    ssr: { external: ["@prisma/client"] },
}));
