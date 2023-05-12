/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}", "../../packages/ui/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                hatton: ["hatton"],
                "hatton-medium": ["hatton-medium"],
                "hatton-semibold": ["hatton-semibold"],
            },
        },
    },
    plugins: [],
};
