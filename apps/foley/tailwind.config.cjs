/** @type {import('tailwindcss').Config} */

module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}", "../../packages/ui/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                underdog: ["var(--font-underdog)"],
                "nixie-one": ["var(--font-nixie-one)"],
                "londrina-sketch": ["var(--font-londrina-sketch)"],
            },
        },
    },
    plugins: [],
};
