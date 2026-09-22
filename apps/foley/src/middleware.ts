import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { URLS } from "@utils/enums";
import {
    NextResponse,
    type NextFetchEvent,
    type NextRequest,
} from "next/server";
import {
    makeRateLimitHeaders,
} from "@utils/rateLimit";
import { extractIpFromRequest } from "./ipHelper";

const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.fixedWindow(69, "10 s"),
});
const contactRateLimitPerMinute = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(1, "60 s"),
    prefix: "contact-ip-1m",
});
const contactRateLimitPer15Min = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(3, "15 m"),
    prefix: "contact-ip-15m",
});
const contactRateLimitPerDay = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(6, "24 h"),
    prefix: "contact-ip-24h",
});
const API_PROTECTED_ROUTES = [
    URLS.API_SMOL_CREATE,
    URLS.API_QR_CREATE,
    URLS.API_EMAIL_SEND,
];

export const config = {
    matcher: ["/api/:path*", "/s/:path*"],
};

export default async function handler(req: NextRequest, ev: NextFetchEvent) {
    try {
        const onSmol = req.nextUrl.pathname.startsWith(URLS.SMOL);
        const onSmolRedirect =
            onSmol && req.nextUrl.pathname.length > `${URLS.SMOL}/`.length;
        const onApi = req.nextUrl.pathname.startsWith("/api/");

        if (onSmolRedirect) {
            return await handleSmolRedirect(req);
        } else if (
            (onSmol && !onSmolRedirect) ||
            req.nextUrl.hostname ===
                "localhost" /** we don't want to rate limit dev */
        ) {
            return NextResponse.next();
        }

        if (onApi) {
            if (req.nextUrl.pathname === URLS.API_CONTACT) {
                const isContactExceeded = await validateContactRateLimit(req, ev);

                if (isContactExceeded) {
                    return isContactExceeded;
                }
            }

            const isExceeded = await validateRateLimit(req, ev);

            if (isExceeded) {
                return isExceeded;
            }

            if (!API_PROTECTED_ROUTES.includes(req.nextUrl.pathname)) {
                return NextResponse.next();
            }

            const sessionToken =
                req.cookies.get("__Secure-next-auth.session-token") ||
                req.cookies.get("next-auth.session-token");

            // TODO add expired check, session validation
            if (!sessionToken) {
                console.error(
                    "middleware could not find session token on path",
                    req.nextUrl.pathname
                );

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

async function validateRateLimit(
    req: NextRequest,
    ev: NextFetchEvent
) {
    const ip = extractIpFromRequest(req);
    const { success, pending, limit, remaining, reset } = await ratelimit.limit(
        `mw_${ip}`
    );
    ev.waitUntil(pending);

    if (!success) {
        return makeRateLimitResponse(limit, remaining, reset);
    }
}

async function validateContactRateLimit(
    req: NextRequest,
    ev: NextFetchEvent
) {
    const ip = extractIpFromRequest(req);
    const key = `contact_ip_${ip}`;
    const checks = await Promise.all([
        contactRateLimitPerMinute.limit(key),
        contactRateLimitPer15Min.limit(key),
        contactRateLimitPerDay.limit(key),
    ]);

    ev.waitUntil(Promise.all(checks.map((check) => check.pending)));

    for (const check of checks) {
        if (!check.success) {
            return makeRateLimitResponse(check.limit, check.remaining, check.reset);
        }
    }
}

function makeRateLimitResponse(
    limit: number,
    remaining: number,
    reset: number
): NextResponse {
    const res = NextResponse.json(
        { message: "Too many requests. Try again later." },
        { status: 429 }
    );
    const headers = makeRateLimitHeaders(limit, remaining, reset);
    for (const [key, value] of Object.entries(headers)) {
        res.headers.set(key, value);
    }

    return res;
}
