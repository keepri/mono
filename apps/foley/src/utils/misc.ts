import { Langs } from "@declarations/enums";
import { CookieSerializeOptions } from "@declarations/types";

export const siteName = "K";
export const siteHost = "kipri.dev";
export const isProduction = process.env.NODE_ENV === "production";
export const defaultLanguage = Langs.en;
export const protocol = isProduction ? "https://" : "http://";
export const port = ":3001";
export const host = isProduction ? siteHost : "localhost";
export const origin = protocol + host;

// COOKIES
export const defaultCookieOptions: CookieSerializeOptions = {
    secure: isProduction,
    httpOnly: true,
    sameSite: isProduction ? "strict" : "lax",
    path: "/",
    domain: host,
};
