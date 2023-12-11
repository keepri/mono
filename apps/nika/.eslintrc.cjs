module.exports = {
    env: {
        browser: true,
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
    },
    plugins: ["@typescript-eslint", "solid"],
    extends: [
        "airbnb-base",
        "airbnb-typescript/base",
        "eslint:recommended",
        "plugin:prettier/recommended",
        "plugin:solid/recommended",
        "plugin:solid/typescript",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:@typescript-eslint/strict",
    ],
    rules: {
        "import/prefer-default-export": "off",
        "import/extensions": [
            "warn",
            {
                js: "never",
            },
        ],
        "no-underscore-dangle": "off",
        "no-console": "off",
        "no-param-reassign": "off",
        "prettier/prettier": [
            "error",
            {
                endOfLine: "auto",
            },
        ],
        "react-hooks/exhaustive-deps": "warn",
        "react-hooks/rules-of-hooks": "off",
        "@typescript-eslint/unbound-method": "off",
        "@typescript-eslint/consistent-type-definitions": ["error", "type"],
        "@typescript-eslint/consistent-type-imports": "warn",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/ban-ts-comment": "warn",
        "@typescript-eslint/no-empty-interface": [
            "warn",
            {
                allowSingleExtends: true,
            },
        ],
        quotes: [
            "warn",
            "double",
            {
                avoidEscape: true,
                allowTemplateLiterals: true,
            },
        ],
        semi: ["error", "always"],
        "max-len": [
            "warn",
            {
                code: 121,
                ignoreComments: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
                ignoreRegExpLiterals: true,
            },
        ],
        indent: [
            "warn",
            4,
            {
                SwitchCase: 1,
                VariableDeclarator: 2,
                ignoredNodes: ["ConditionalExpression"],
            },
        ],
        "no-void": "off",
        "no-empty-pattern": ["warn"],
        "no-mixed-spaces-and-tabs": "off",
    },
    ignorePatterns: ["**/*.cjs", "**/*.mjs"],
};
