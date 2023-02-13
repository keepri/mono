import { URLS } from "@declarations/enums";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

const ratelimit = new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.fixedWindow(7, "10 s") });

export default async function handler(req: NextRequest, ev: NextFetchEvent) {
    const nextUrl = req.nextUrl;
    const onSmol = nextUrl.pathname.startsWith(`${URLS.SMOL}/`);
    const onApi = nextUrl.pathname.startsWith("/api/");

    // early escape
    if (!onSmol || !onApi) {
        return NextResponse.next();
    }

    // all api endpoints
    if (onApi) {
        const ip = req.ip ?? "127.0.0.1";
        const { success, pending, limit, remaining, reset } = await ratelimit.limit(`mw_${ip}`);
        ev.waitUntil(pending);

        if (!success) {
            const res = NextResponse.json({ message: "chill" });
            res.headers.set("X-RateLimit-Limit", limit.toString());
            res.headers.set("X-RateLimit-Remaining", remaining.toString());
            res.headers.set("X-RateLimit-Reset", reset.toString());
            return res;
        }
    }

    // smol pages
    if (onSmol) {
        const pathname = req.nextUrl.pathname;
        const origin = req.nextUrl.origin;
        const slug = pathname.split("/").pop();

        if (typeof slug !== "string") {
            return NextResponse.json({ message: "invalid slug" });
        }

        const getSmolBySlug = (await import("@utils/helpers")).getSmolBySlug;
        const smolRes = await getSmolBySlug(slug, { client: true, origin });

        if ("message" in smolRes) {
            return NextResponse.json({ message: smolRes.message });
        }

        return NextResponse.redirect(smolRes.smol.url);
    }

    return NextResponse.next();
}
