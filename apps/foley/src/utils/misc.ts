import { Langs } from "@utils/enums";
import { CookieOptions } from "@utils/types";
import { Inconsolata, Londrina_Sketch, Nixie_One, Underdog } from "next/font/google";

export const inconsolata = Inconsolata({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    preload: true,
    variable: "--font-inconsolata",
});

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
export const defaultCookieOptions: CookieOptions = {
    secure: isProduction,
    httpOnly: true,
    sameSite: isProduction ? "strict" : "lax",
    path: "/",
    domain: host,
};
