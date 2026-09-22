import { beforeEach, describe, expect, test, vi } from "vitest";
import handler from "./middleware";

const rateState = new Map<string, number>();

vi.mock("@upstash/ratelimit", () => {
    class MockRatelimit {
        private readonly limitValue: number;
        private readonly prefix: string;

        constructor(config: { limiter: { limit: number }; prefix?: string }) {
            this.limitValue = config.limiter.limit;
            this.prefix = config.prefix ?? "default";
        }

        static fixedWindow(limit: number) {
            return { limit };
        }

        static slidingWindow(limit: number) {
            return { limit };
        }

        async limit(key: string) {
            const counterKey = `${this.prefix}:${key}`;
            const count = (rateState.get(counterKey) ?? 0) + 1;
            rateState.set(counterKey, count);

            return {
                success: count <= this.limitValue,
                limit: this.limitValue,
                remaining: Math.max(0, this.limitValue - count),
                reset: Math.floor(Date.now() / 1000) + 60,
                pending: Promise.resolve(),
            };
        }
    }

    return { Ratelimit: MockRatelimit };
});

vi.mock("@upstash/redis", () => ({
    Redis: {
        fromEnv: () => ({ mocked: true }),
    },
}));

describe("middleware contact spam protection", () => {
    beforeEach(() => {
        rateState.clear();
    });

    test("blocks second rapid /api/contact request from same IP", async () => {
        const ev = { waitUntil: vi.fn() } as any;
        const firstReq = makeRequest("/api/contact", "1.2.3.4");
        const secondReq = makeRequest("/api/contact", "1.2.3.4");

        const firstRes = await handler(firstReq, ev);
        const secondRes = await handler(secondReq, ev);

        expect(firstRes.status).toBe(200);
        expect(secondRes.status).toBe(429);
        expect(secondRes.headers.get("X-RateLimit-Limit")).toBe("1");
        expect(secondRes.headers.get("Retry-After")).toBeTruthy();
        await expect(secondRes.json()).resolves.toEqual({
            message: "Too many requests. Try again later.",
        });
    });
});

function makeRequest(pathname: string, ip: string, hostname = "kipri.dev") {
    return {
        nextUrl: {
            pathname,
            hostname,
        },
        headers: {
            get: (key: string) => {
                const lower = key.toLowerCase();
                if (lower === "x-forwarded-for") return ip;
                if (lower === "x-real-ip") return null;
                return null;
            },
        },
        cookies: {
            get: () => undefined,
        },
    } as any;
}
