import { Langs } from "@utils/enums";
import { CookieOptions } from "@utils/types";

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
