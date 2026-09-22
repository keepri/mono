import { describe, expect, test } from "vitest";
import {
    getRetryAfterSeconds,
    makeRateLimitHeaders,
} from "./utils/rateLimit";
import {
    getDuplicateRateKey,
    getEmailRateKey,
    isAllowedOrigin,
    normalizeEmail,
    normalizeMessage,
} from "./utils/contactRateLimit";

describe("rate limit helpers", () => {
    test("getRetryAfterSeconds handles ms timestamp", () => {
        const now = 1700000000000;
        const reset = now + 5000;
        expect(getRetryAfterSeconds(reset, now)).toBe("5");
    });

    test("makeRateLimitHeaders includes retry and limit headers", () => {
        const headers = makeRateLimitHeaders(6, 0, 12, 5000);

        expect(headers["X-RateLimit-Limit"]).toBe("6");
        expect(headers["X-RateLimit-Remaining"]).toBe("0");
        expect(headers["X-RateLimit-Reset"]).toBe("12");
        expect(headers["Retry-After"]).toBe("7");
    });
});

describe("contact rate limit helpers", () => {
    test("normalizeMessage collapses whitespace and lowercases", () => {
        expect(normalizeMessage("  Hi   THERE\nfriend  ")).toBe("hi there friend");
    });

    test("normalizeEmail trims and lowercases", () => {
        expect(normalizeEmail("  A.B+tag@Example.COM  ")).toBe(
            "a.b+tag@example.com"
        );
    });

    test("getEmailRateKey normalizes casing and spaces", () => {
        const a = getEmailRateKey("Test@Example.com");
        const b = getEmailRateKey("  test@example.com  ");
        expect(a).toBe(b);
    });

    test("getDuplicateRateKey normalizes message whitespace/case", () => {
        const a = getDuplicateRateKey("Test@Example.com", "  Hello   THERE ");
        const b = getDuplicateRateKey(" test@example.com ", "hello there");
        expect(a).toBe(b);
    });

    test("isAllowedOrigin accepts missing origin", () => {
        const req = { headers: {} } as any;
        expect(isAllowedOrigin(req, "https://kipri.dev")).toBe(true);
    });

    test("isAllowedOrigin accepts localhost and host", () => {
        const localReq = { headers: { origin: "http://localhost:3001" } } as any;
        const hostReq = { headers: { origin: "https://kipri.dev" } } as any;

        expect(isAllowedOrigin(localReq, "https://kipri.dev")).toBe(true);
        expect(isAllowedOrigin(hostReq, "https://kipri.dev")).toBe(true);
    });

    test("isAllowedOrigin rejects unknown host", () => {
        const req = { headers: { origin: "https://evil.example" } } as any;
        expect(isAllowedOrigin(req, "https://kipri.dev")).toBe(false);
    });
});
