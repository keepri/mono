import { beforeAll, describe, expect, test } from "vitest";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { getDuplicateRateKey, getEmailRateKey } from "./utils/contactRateLimit";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const hasRedisCreds = Boolean(redisUrl && redisToken);
const describeIfRedis = hasRedisCreds ? describe : describe.skip;

describeIfRedis("upstash rate limit integration", () => {
    const redis = new Redis({
        url: redisUrl!,
        token: redisToken!,
    });
    const runId = `rltest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const ipLimiterMinute = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(1, "60 s"),
        prefix: `${runId}_contact-ip-1m`,
    });

    const emailLimiter2h = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(1, "2 h"),
        prefix: `${runId}_contact-email-2h`,
    });

    const duplicateLimiter7d = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(1, "7 d"),
        prefix: `${runId}_contact-duplicate-7d`,
    });

    beforeAll(async () => {
        await redis.ping();
    });

    test("IP 1/60s blocks second request", async () => {
        const key = `${runId}_ip_1`;
        const first = await ipLimiterMinute.limit(key);
        const second = await ipLimiterMinute.limit(key);

        await Promise.all([first.pending, second.pending]);

        expect(first.success).toBe(true);
        expect(second.success).toBe(false);
    });

    test("IP 3/15m blocks fourth rapid request", async () => {
        const limiter = new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(3, "15 m"),
            prefix: `${runId}_contact-ip-15m`,
        });
        const key = `${runId}_ip_15m_1`;
        const a = await limiter.limit(key);
        const b = await limiter.limit(key);
        const c = await limiter.limit(key);
        const d = await limiter.limit(key);

        await Promise.all([a.pending, b.pending, c.pending, d.pending]);

        expect(a.success).toBe(true);
        expect(b.success).toBe(true);
        expect(c.success).toBe(true);
        expect(d.success).toBe(false);
    });

    test("Email 1/2h blocks second request", async () => {
        const key = getEmailRateKey(`Spammer+${runId}@example.com`);
        const first = await emailLimiter2h.limit(key);
        const second = await emailLimiter2h.limit(key);

        await Promise.all([first.pending, second.pending]);

        expect(first.success).toBe(true);
        expect(second.success).toBe(false);
    });

    test("Email limiter blocks case/space variants of same address", async () => {
        const limiter = new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(1, "2 h"),
            prefix: `${runId}_contact-email-2h-normalized`,
        });
        const firstKey = getEmailRateKey(`Foo.Bar+${runId}@Example.com`);
        const secondKey = getEmailRateKey(`  foo.bar+${runId}@example.com  `);
        const first = await limiter.limit(firstKey);
        const second = await limiter.limit(secondKey);

        await Promise.all([first.pending, second.pending]);

        expect(first.success).toBe(true);
        expect(second.success).toBe(false);
    });

    test("Duplicate 1/7d blocks second request", async () => {
        const key = getDuplicateRateKey(
            `spam+${runId}@example.com`,
            "Hello world"
        );
        const first = await duplicateLimiter7d.limit(key);
        const second = await duplicateLimiter7d.limit(key);

        await Promise.all([first.pending, second.pending]);

        expect(first.success).toBe(true);
        expect(second.success).toBe(false);
    });

    test("Duplicate limiter blocks trivial message variants", async () => {
        const limiter = new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(1, "7 d"),
            prefix: `${runId}_contact-duplicate-7d-normalized`,
        });
        const firstKey = getDuplicateRateKey(
            `dupe+${runId}@example.com`,
            "Buy NOW   please"
        );
        const secondKey = getDuplicateRateKey(
            ` DUPE+${runId}@example.com `,
            "buy now please"
        );
        const first = await limiter.limit(firstKey);
        const second = await limiter.limit(secondKey);

        await Promise.all([first.pending, second.pending]);

        expect(first.success).toBe(true);
        expect(second.success).toBe(false);
    });
});
