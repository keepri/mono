import { screens } from "tailwindcss/defaultTheme";

/** @type {import("tailwindcss").Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}", "../../packages/ui/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        /** @type {import("tailwindcss/types/config").ThemeConfig["container"]} */
        container: {
            center: true,
            padding: {
                DEFAULT: "1rem",
                sm: "2rem",
                lg: "4rem",
                xl: "5rem",
                "2xl": "6rem",
            },
        },
        extend: {
            screens: {
                ...screens,
                xxs: "340px",
                xs: "480px",
            },
            colors: {
                ivory: "#FFFFF9",
            },
            fontFamily: {
                underdog: ["var(--font-underdog)"],
                inconsolata: ["var(--font-inconsolata)"],
                "nixie-one": ["var(--font-nixie-one)"],
                "londrina-sketch": ["var(--font-londrina-sketch)"],
                "jua": ["var(--font-jua)"],
            },
        },
    },
};
