import { URLS } from "@declarations/enums";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

const ratelimit = new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.fixedWindow(69, "10 s") });

export default async function handler(req: NextRequest, ev: NextFetchEvent) {
    const { pathname } = req.nextUrl;
    const origin = req.nextUrl.origin;
    const pathSplit = pathname.split("/");
    pathSplit.splice(0, 1);
    const pathSplitLen = pathSplit.length;
    const slug = pathSplit.pop();

    const onSmolRedirect = pathname.startsWith(URLS.SMOL) && Boolean(slug?.length) && pathSplitLen === 2;
    const onApi = pathname.startsWith("/api/");

    // early escape
    if (!onSmolRedirect && !onApi) {
        return NextResponse.next();
    }

    // smol pages
    if (onSmolRedirect) {
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


    return NextResponse.next();
}
