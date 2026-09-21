import { NextRequest } from "next/server";

export function extractIpFromRequest(req: NextRequest): string {
    const forwarded = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    return forwarded ? forwarded.split(",")[0].trim() : realIp ?? "127.0.0.1";
}
