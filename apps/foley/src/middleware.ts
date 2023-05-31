import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { URLS } from "@utils/enums";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";

const ratelimit = new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.fixedWindow(69, "10 s") });

export default async function handler(req: NextRequest, ev: NextFetchEvent) {
    const onSmolRedirect =
        req.nextUrl.pathname.startsWith(`${URLS.SMOL}/`) && req.nextUrl.pathname.length > `${URLS.SMOL}/`.length;
    const onApi = req.nextUrl.pathname.startsWith("/api/");

    // early escape?
    if (!onSmolRedirect && !onApi) return NextResponse.next();

    // smol redirect urls
    if (onSmolRedirect) {
        const slug = req.nextUrl.pathname.split("/").at(-1);

        if (!slug) return NextResponse.rewrite(URLS.SMOL);

        try {
            const fetchSmolBySlug = (await import("@utils/helpers")).fetchSmolBySlug;
            const smol = await fetchSmolBySlug(slug);

            return NextResponse.redirect(smol.url);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch ({ stack, message }: any) {
            console.error(stack);
            console.error("smol redirect", message);
            return NextResponse.rewrite(URLS.SMOL);
        }
    }

    // all api endpoints
    if (onApi) {
        const ip = req.ip ?? "127.0.0.1";
        const { success, pending, limit, remaining, reset } = await ratelimit.limit(`mw_${ip}`);
        ev.waitUntil(pending);

        if (!success) {
            const res = NextResponse.error();
            res.headers.set("X-RateLimit-Limit", limit.toString());
            res.headers.set("X-RateLimit-Remaining", remaining.toString());
            res.headers.set("X-RateLimit-Reset", reset.toString());
            return res;
        }

        // TODO add session validation for predefined vec of routes
        // atm session validation happens separately

        return NextResponse.next();
    }

    return NextResponse.error();
}
