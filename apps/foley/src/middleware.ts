import { URLS } from "@declarations/enums";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { type NextFetchEvent, type NextRequest, NextResponse } from "next/server";

const ratelimit = new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.fixedWindow(69, "10 s") });

export default async function handler(req: NextRequest, ev: NextFetchEvent) {
    const onSmolRedirect = req.nextUrl.pathname.startsWith(`${URLS.SMOL}/`) && req.nextUrl.pathname.length > `${URLS.SMOL}/`.length;
    const onApi = req.nextUrl.pathname.startsWith("/api/");

    // early escape?
    if (!onSmolRedirect && !onApi) return NextResponse.next();

    // all api endpoints
    if (onApi) {
        const ip = req.ip ?? "127.0.0.1";
        const { success, pending, limit, remaining, reset } = await ratelimit.limit(`mw_${ip}`);
        ev.waitUntil(pending);

        if (!success) {
            const res = NextResponse.json({ yo: "chill" });
            res.headers.set("X-RateLimit-Limit", limit.toString());
            res.headers.set("X-RateLimit-Remaining", remaining.toString());
            res.headers.set("X-RateLimit-Reset", reset.toString());
            return res;
        }

        // TODO add session validation for predefined vec of routes
        // atm session validation happens separately

        return NextResponse.next();
    }

    // smol pages
    if (onSmolRedirect) {
        const slugSmol = req.nextUrl.pathname.split("/").at(-1);

        if (slugSmol) {
            const getSmolBySlug = (await import("@utils/helpers")).getSmolBySlug;
            const smolRes = await getSmolBySlug(slugSmol, { client: true, origin: req.nextUrl.origin });

            if ("message" in smolRes) {
                return NextResponse.json({ oops: smolRes.message });
            }

            return NextResponse.redirect(smolRes.smol.url);
        }

        return NextResponse.rewrite(URLS.SMOL);
    }

    return NextResponse.error();
}
