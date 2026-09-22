import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { spawn, type ChildProcessByStdio } from "node:child_process";
import type { Readable } from "node:stream";
const appDir = process.cwd();

const runE2E = process.env.RUN_NEXT_E2E === "1";
const hasUpstashCreds = Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);
const describeE2E = runE2E && hasUpstashCreds ? describe : describe.skip;

describeE2E("contact anti-spam e2e (middleware + api)", () => {
    let serverProcess: ChildProcessByStdio<null, Readable, Readable> | null =
        null;
    const port = 3137;
    const host = `http://127.0.0.1:${port}`;

    beforeAll(async () => {
        const env = {
            ...process.env,
            HOST: host,
        };

        serverProcess = spawn("bun", ["x", "next", "dev", "--port", `${port}`], {
            cwd: appDir,
            env,
            stdio: ["ignore", "pipe", "pipe"],
        });

        await waitForServerReady(host);
    }, 120000);

    afterAll(async () => {
        if (!serverProcess) {
            return;
        }

        serverProcess.kill("SIGTERM");
        await new Promise<void>((resolveDone) => {
            serverProcess?.once("exit", () => resolveDone());
            setTimeout(resolveDone, 2000);
        });
    });

    test("second rapid contact submit blocked in middleware->api stack", async () => {
        const ip = `203.0.113.${Math.floor(Math.random() * 200) + 10}`;
        const body = {
            name: "spam",
            email: `spam-${Date.now()}@example.com`,
            message: "buy now",
            website: "",
            startedAt: Date.now(),
        };

        const first = await fetch(`${host}/api/contact`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "x-forwarded-for": ip,
                origin: host,
            },
            body: JSON.stringify(body),
        });

        expect(first.status).toBe(429);
        expect(first.headers.get("x-ratelimit-limit")).toBeNull();

        const second = await fetch(`${host}/api/contact`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "x-forwarded-for": ip,
                origin: host,
            },
            body: JSON.stringify(body),
        });

        expect(second.status).toBe(429);
        const limitHeader = second.headers.get("x-ratelimit-limit");
        const bodyText = await second.text();

        if (limitHeader) {
            expect(limitHeader).toBe("1");
            expect(second.headers.get("retry-after")).toBeTruthy();
            expect(JSON.parse(bodyText)).toEqual({
                message: "Too many requests. Try again later.",
            });
            return;
        }

        expect(bodyText).toBe("Too many requests. Try again later.");
    });
});

async function waitForServerReady(host: string): Promise<void> {
    const deadline = Date.now() + 60000;

    while (Date.now() < deadline) {
        try {
            const res = await fetch(host);
            if (res.status >= 200 && res.status < 500) {
                return;
            }
        } catch {
            // retry
        }

        await sleep(500);
    }

    throw new Error("next dev server did not become ready in time");
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}
