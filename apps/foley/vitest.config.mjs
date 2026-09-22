import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

const src = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
    resolve: {
        alias: {
            "@utils": `${src}/utils`,
            "@env": `${src}/env`,
            "@components": `${src}/components`,
            "@pages": `${src}/pages`,
            "@styles": `${src}/styles`,
        },
    },
    test: {
        environment: "node",
    },
});
