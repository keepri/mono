export function getRetryAfterSeconds(reset: number, now = Date.now()): string {
    const resetMs = reset > 1000000000000 ? reset : reset * 1000;
    const diffSeconds = Math.ceil((resetMs - now) / 1000);

    return Math.max(1, diffSeconds).toString();
}

export function makeRateLimitHeaders(
    limit: number,
    remaining: number,
    reset: number,
    now = Date.now()
): Record<string, string> {
    return {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString(),
        "Retry-After": getRetryAfterSeconds(reset, now),
    };
}
