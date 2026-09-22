import { beforeEach, describe, expect, test, vi } from "vitest";
import type { NextApiRequest, NextApiResponse } from "next";
import handler from "./contact";
import { prisma } from "db";
import { sendEmail } from "@utils/email";
import { validateSession$ } from "@utils/helpers";

type LimiterCheck = {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
};

type LimiterBehavior = LimiterCheck | Array<LimiterCheck> | Error;

const limiterBehaviors: Record<string, LimiterBehavior> = {};

vi.mock("@upstash/ratelimit", () => {
    class MockRatelimit {
        readonly prefix: string;

        constructor(config: { prefix: string }) {
            this.prefix = config.prefix;
        }

        static slidingWindow(limit: number, window: string) {
            return { limit, window };
        }

        async limit() {
            const behavior = limiterBehaviors[this.prefix];

            if (behavior instanceof Error) {
                throw behavior;
            }

            if (Array.isArray(behavior)) {
                const next = behavior.shift() ?? defaultLimiterCheck();
                return { ...next, pending: Promise.resolve() };
            }

            const result = behavior ?? defaultLimiterCheck();

            return { ...result, pending: Promise.resolve() };
        }
    }

    return { Ratelimit: MockRatelimit };
});

vi.mock("@upstash/redis", () => ({
    Redis: {
        fromEnv: () => ({ mocked: true }),
    },
}));

vi.mock("@env/server.mjs", () => ({
    serverEnv: {
        HOST: "https://kipri.dev",
        CONTACT_EMAIL: "contact@kipri.dev",
    },
}));

vi.mock("@utils/email", () => ({
    sendEmail: vi.fn(async () => void 0),
}));

vi.mock("@utils/helpers", () => ({
    validateSession$: vi.fn(async () => null),
}));

vi.mock("db", () => ({
    prisma: {
        contact: {
            create: vi.fn(async ({ data }) => ({
                id: 42,
                createdAt: new Date("2026-01-01T00:00:00.000Z"),
                email: data.email,
                ...data,
            })),
        },
        user: {
            findFirst: vi.fn(async () => null),
        },
    },
}));

describe("contact api anti-spam", () => {
    beforeEach(() => {
        for (const key of Object.keys(limiterBehaviors)) {
            delete limiterBehaviors[key];
        }

        vi.clearAllMocks();
        vi.mocked(validateSession$).mockResolvedValue(null);
    });

    test("blocks too-fast submission with 429", async () => {
        const req = makeRequest({ startedAt: Date.now() });
        const res = makeResponse();

        await handler(req, res);

        expect(res.statusCode).toBe(429);
        expect(prisma.contact.create).not.toHaveBeenCalled();
    });

    test("blocks honeypot submission with 429", async () => {
        const req = makeRequest({ website: "https://spam.example" });
        const res = makeResponse();

        await handler(req, res);

        expect(res.statusCode).toBe(429);
        expect(prisma.contact.create).not.toHaveBeenCalled();
    });

    test("blocks repeated spam on second request via email limiter", async () => {
        limiterBehaviors["contact-email-2h"] = [
            {
                success: true,
                limit: 1,
                remaining: 0,
                reset: futureReset(60),
            },
            {
                success: false,
                limit: 1,
                remaining: 0,
                reset: futureReset(60),
            },
        ];

        const firstReq = makeRequest();
        const firstRes = makeResponse();
        await handler(firstReq, firstRes);

        const secondReq = makeRequest();
        const secondRes = makeResponse();
        await handler(secondReq, secondRes);

        expect(firstRes.statusCode).toBe(200);
        expect(secondRes.statusCode).toBe(429);
        expect(secondRes.headers["X-RateLimit-Limit"]).toBe("1");
        expect(secondRes.headers["Retry-After"]).toBeDefined();
        expect(prisma.contact.create).toHaveBeenCalledTimes(1);
    });

    test("blocks anonymous submit when limiter backend fails", async () => {
        limiterBehaviors["contact-email-2h"] = new Error("redis down");

        const req = makeRequest();
        const res = makeResponse();
        await handler(req, res);

        expect(res.statusCode).toBe(429);
        expect(prisma.contact.create).not.toHaveBeenCalled();
    });

    test("allows authenticated submit when limiter backend fails", async () => {
        limiterBehaviors["contact-email-2h"] = new Error("redis down");
        vi.mocked(validateSession$).mockResolvedValue({ userId: 777 } as any);

        const req = makeRequest();
        const res = makeResponse();
        await handler(req, res);

        expect(res.statusCode).toBe(200);
        expect(prisma.contact.create).toHaveBeenCalledTimes(1);
        expect(prisma.contact.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({ userId: 777 }),
            })
        );
        expect(sendEmail).toHaveBeenCalledTimes(1);
    });
});

function makeRequest(
    overrides?: Partial<{
        origin: string;
        startedAt: number;
        website: string;
        email: string;
        message: string;
    }>
): NextApiRequest {
    return {
        method: "POST",
        headers: {
            origin: overrides?.origin ?? "https://kipri.dev",
        },
        body: {
            name: "spammer",
            email: overrides?.email ?? "spam@example.com",
            message: overrides?.message ?? "buy now",
            website: overrides?.website ?? "",
            startedAt: overrides?.startedAt ?? Date.now() - 6000,
        },
    } as any;
}

function makeResponse(): NextApiResponse & {
    statusCode: number;
    body: unknown;
    headers: Record<string, string>;
} {
    const res = {
        statusCode: 200,
        body: undefined as unknown,
        headers: {} as Record<string, string>,
        status(code: number) {
            this.statusCode = code;
            return this;
        },
        send(payload: unknown) {
            this.body = payload;
            return this;
        },
        setHeader(key: string, value: string) {
            this.headers[key] = value;
        },
    };

    return res as any;
}

function defaultLimiterCheck(): LimiterCheck {
    return {
        success: true,
        limit: 1,
        remaining: 0,
        reset: futureReset(60),
    };
}

function futureReset(seconds: number): number {
    return Math.floor(Date.now() / 1000) + seconds;
}
