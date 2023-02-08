// eslint-disable-next-line @typescript-eslint/no-var-requires
const { join } = require("path");

module.exports = {
    root: true,
    extends: ["custom"],
    settings: {
        "import/parsers": {
            "@typescript-eslint/parser": [".js", ".jsx", ".ts", ".tsx"],
        },
        "import/resolver": {
            typescript: {
                project: join(__dirname, "tsconfig.json"),
            },
            node: {
                extensions: [".js", ".jsx", ".ts", ".tsx"],
            },
        },
    },
};
