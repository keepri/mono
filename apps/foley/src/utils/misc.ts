import { Underdog, Nixie_One, Londrina_Sketch } from "@next/font/google";
import { Langs } from "@declarations/enums";
import { CookieSerializeOptions } from "@declarations/types";

export const underdog = Underdog({
    weight: "400",
    subsets: ["latin"],
    style: ["normal"],
    preload: true,
    variable: "--font-underdog",
});

export const nixieOne = Nixie_One({
    weight: "400",
    subsets: ["latin"],
    style: ["normal"],
    preload: true,
    variable: "--font-nixie-one",
});

export const londrinaSketch = Londrina_Sketch({
    weight: "400",
    subsets: ["latin"],
    style: ["normal"],
    preload: true,
    variable: "--font-londrina-sketch",
});

export const siteName = "K";
export const siteHost = "kipri.dev";
export const isProduction = process.env.NODE_ENV === "production";
export const defaultLanguage = Langs.en;
export const protocol = isProduction ? "https://" : "http://";
export const port = ":3001";
export const host = isProduction ? siteHost : "localhost";
export const origin = protocol + (isProduction ? host : host + port);

// COOKIES
export const defaultCookieOptions: CookieSerializeOptions = {
    secure: isProduction,
    httpOnly: true,
    sameSite: isProduction ? "strict" : "lax",
    path: "/",
    domain: host,
};
