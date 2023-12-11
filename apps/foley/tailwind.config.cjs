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
            keyframes: {
                "wiggle-rotate": {
                    "0%, 100%": { transform: "rotate(-1deg)" },
                    "50%": { transform: "rotate(1deg)" },
                },
                "wiggle-translate": {
                    "0%, 100%": { transform: "translate(-3px)" },
                    "50%": { transform: "translate(3px)" },
                }
            },
            animation: {
                "wiggle-rotate": "wiggle-rotate 250ms ease-in-out infinite",
                "wiggle-translate": "wiggle-translate 250ms ease-in-out infinite",
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
