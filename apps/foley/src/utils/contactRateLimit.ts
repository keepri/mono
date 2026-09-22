import { createHash } from "crypto";
import { type NextApiRequest } from "next";

const localhostHosts = ["localhost:3001", "127.0.0.1:3001"];

export function normalizeMessage(value: string): string {
    return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export function normalizeEmail(value: string): string {
    return value.trim().toLowerCase();
}

function hashKey(value: string): string {
    return createHash("sha256").update(value).digest("hex");
}

export function getEmailRateKey(email: string): string {
    return `email_${hashKey(normalizeEmail(email))}`;
}

export function getDuplicateRateKey(email: string, message: string): string {
    return `dup_${hashKey(`${normalizeEmail(email)}:${normalizeMessage(message)}`)}`;
}

export function isAllowedOrigin(req: NextApiRequest, host: string): boolean {
    const origin = req.headers.origin;

    if (!origin) {
        return true;
    }

    try {
        const allowedHosts = [new URL(host).host, ...localhostHosts];
        const originHost = new URL(origin).host;

        return allowedHosts.includes(originHost);
    } catch {
        return false;
    }
}
