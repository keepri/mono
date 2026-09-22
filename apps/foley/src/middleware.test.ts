import { expect, test } from "vitest";
import { extractIpFromRequest } from "./ipHelper";

test("extract IP from x-forwarded-for header", () => {
    const req = {
        headers: {
            get: (key: string) => {
                if (key.toLowerCase() === "x-forwarded-for") return "1.2.3.4, 5.6.7.8";
                if (key.toLowerCase() === "x-real-ip") return null;
                return null;
            },
        },
    } as any;
    expect(extractIpFromRequest(req)).toBe("1.2.3.4");
});
