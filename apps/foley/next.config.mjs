import { dirname, join } from "path";
import { serverEnv } from "./src/env/server.mjs";
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";

/**
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
    return config;
}

export default defineNextConfig({
    transpilePackages: ["ui", "qr", "utils", "db"],
    distDir: join(dirname("."), ".next"),
    reactStrictMode: true,
    env: serverEnv,
    typescript: {
        ignoreBuildErrors: process.env.NODE_ENV === "production" ? true : false,
    },
    images: {
        domains: ["firebasestorage.googleapis.com", "avatars.githubusercontent.com"],
    },
    sassOptions: {
        includePaths: [join(dirname("."), "src", "styles")],
    },
    webpack(config, { isServer }) {
        if (isServer) {
            config.plugins = [...config.plugins, new PrismaPlugin()];
        }

        config.resolve = {
            ...config.resolve,
            fallback: {
                fs: false,
                path: false,
                os: false,
            },
        };

        return config;
    },
});
