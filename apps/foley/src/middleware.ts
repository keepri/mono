import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { URLS } from "@utils/enums";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { getSessionByToken$ } from "@utils/helpers";

const ratelimit = new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.fixedWindow(69, "10 s") });
const API_PROTECTED_ROUTES: Set<URLS> = new Set<URLS>([URLS.API_SMOL_CREATE, URLS.API_QR_CREATE, URLS.API_EMAIL_SEND]);

export const config = {
    matcher: ["/api/:path*", "/s/:path*"],
};

export default async function handler(req: NextRequest, ev: NextFetchEvent) {
    try {
        const onSmol = req.nextUrl.pathname.startsWith(URLS.SMOL);
        const onSmolRedirect = onSmol && req.nextUrl.pathname.length > `${URLS.SMOL}/`.length;
        const onApi = req.nextUrl.pathname.startsWith("/api/");

        if (onSmolRedirect) {
            return await handleSmolRedirect(req);
        } else if (
            (onSmol && !onSmolRedirect) ||
            req.nextUrl.pathname.startsWith(URLS.API_AUTH) ||
            req.nextUrl.hostname === "localhost" /** we don't want to rate limit dev */
        ) {
            return NextResponse.next();
        }

        if (onApi) {
            const isExceeded = await validateRateLimit(req, ev);

            if (isExceeded) {
                return isExceeded;
            }

            if (!API_PROTECTED_ROUTES.has(req.nextUrl.pathname as URLS)) {
                return NextResponse.next();
            }

            const sessionToken = req.cookies.get("__Secure-next-auth.session-token") || req.cookies.get("next-auth.session-token");

            // TODO add expired check?
            if (!sessionToken || !(await getSessionByToken$(sessionToken.value))) {
                console.error("middleware could not find session token on path", req.nextUrl.pathname);

                return NextResponse.error();
            }

            return NextResponse.next();
        }

        console.log("middleware failed on path", req.nextUrl.pathname);

        return NextResponse.error();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch ({ stack, message }: any) {
        console.error(stack);
        console.error("middleware failed", message);

        return NextResponse.rewrite(URLS.HOME);
    }
}

async function handleSmolRedirect(req: NextRequest): Promise<NextResponse> {
    const slug = req.nextUrl.pathname.split("/").at(-1);

    if (!slug) {
        return NextResponse.rewrite(URLS.SMOL);
    }

    const fetchSmolBySlug = (await import("@utils/helpers")).fetchSmolBySlug;
    const smol = await fetchSmolBySlug(slug);

    return NextResponse.rewrite(smol.url);
}

async function validateRateLimit(req: NextRequest, ev: NextFetchEvent): Promise<Response | void> {
    const ip = req.ip ?? "127.0.0.1";
    const { success, pending, limit, remaining, reset } = await ratelimit.limit(`mw_${ip}`);
    ev.waitUntil(pending);

    if (success === true) {
        return;
    }

    const res = NextResponse.error();
    res.headers.set("X-RateLimit-Limit", limit.toString());
    res.headers.set("X-RateLimit-Remaining", remaining.toString());
    res.headers.set("X-RateLimit-Reset", reset.toString());

    return res;
}
