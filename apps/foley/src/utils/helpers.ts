import { ErrorStatusSchema, SmolSchema, StatusSmol, SuccessStatusSchema } from "@clfxc/db/schemas";
import { createQRCode, type QRCode } from "@clfxc/services/qr";
import { AcceptedFileTypeSchema } from "@declarations/schemas";
import { URLS } from "@declarations/enums";
import { type ValidateFileReturn } from "@declarations/types";
import { z } from "zod";
import { generateErrorMessage } from "zod-error";
import { IncomingHttpHeaders } from "http";
import { Session } from "@clfxc/db";

export function validateFile(file: File | undefined, maxFileSize?: number): ValidateFileReturn {
    if (!file) return { ok: false };
    const fileType = AcceptedFileTypeSchema.safeParse(file.type);
    if (!fileType.success) {
        console.warn(`invalid file type`);
        return { ok: false, error: fileType.error };
    }

    // convert bytes to megabytes
    // 1e6 = Math.pow(10, 6) ✌️
    const fileSize = toMB(file.size);
    if (fileSize >= (maxFileSize ?? 3)) {
        console.warn(`file too big ${fileSize}mb`);
        return { ok: false, error: "file too big" };
    }

    return { file, ok: true };
}

export function toMB(size: number): number {
    if (typeof size !== "number") return -1;
    return parseFloat((size / 1e6).toFixed(6));
}
export function toKB(size: number): number {
    if (typeof size !== "number") return -1;
    return parseFloat((size / 1e3).toFixed(6));
}

export function readFileAsDataUrl(file: Blob, callback: (e: ProgressEvent<FileReader>) => void): void {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = callback;
}

export function getTextBytes(data: string) {
    const encoder = new TextEncoder();
    const dataEncoded = encoder.encode(data);
    const bytes = dataEncoded.BYTES_PER_ELEMENT * dataEncoded.byteLength;
    return bytes;
}

export async function makeCode(data: string): Promise<QRCode> {
    const { ok, code: newCode, error } = await createQRCode(data);

    if (!ok) {
        console.error("failed making qr code");
        throw error;
    }

    return newCode;
}

const PickedSchema = SmolSchema.pick({ id: true, status: true, url: true });
type PickedSmol = z.infer<typeof PickedSchema>;
type ErrorStatus = z.infer<typeof ErrorStatusSchema>;
type SuccessStatus = z.infer<typeof SuccessStatusSchema>;
type GetSmolUrlOptions = { client: true; origin: string } | { client?: false };
export async function getSmolBySlug<SlugType extends string, OptionsType extends GetSmolUrlOptions>(
    slug: SlugType,
    options?: OptionsType
): Promise<{ status: SuccessStatus; smol: PickedSmol } | { status: ErrorStatus; message: string }> {
    let result: unknown | null = null;

    if (options?.client === true) {
        const url = `${options.origin}/api/smol/${slug}`;
        const smolRes = await fetch(url);
        const smolJson = (await smolRes.json()) as PickedSmol | { message: string };

        if ("message" in smolJson && !smolRes.ok) {
            const status = smolRes.status as ErrorStatus;
            return { status, message: smolJson.message };
        }

        result = smolJson;
    } else {
        const prisma = (await import("@clfxc/db")).prisma;
        const smolRes$ = await prisma.smol.findFirst({
            where: { slug: { equals: slug } },
            select: { status: true, url: true, id: true, accessed: true },
        });

        if (!smolRes$) {
            return { status: 404, message: "not found Sadge" };
        }

        result = smolRes$;

        const update = await prisma.smol.update({
            where: { id: smolRes$.id },
            select: { accessed: true },
            data: { accessed: ++smolRes$.accessed },
        });

        console.log(`smol ${smolRes$.id} was accessed ${update.accessed} times`);
    }

    const parsed = PickedSchema.safeParse(result);
    if (!parsed.success) {
        console.error(generateErrorMessage(parsed.error.issues));
        return { status: 500, message: "something went wrong when parsing smol" };
    }

    if (parsed.data.status !== StatusSmol.active) {
        console.warn("inactive smol url hit");
        return { status: 401, message: "smol not active anymore" };
    }

    return { status: 200, smol: parsed.data };
}

export function isHexCode(str: string): boolean {
    if (str.charAt(0) !== "#" || !(str.length === 4 || str.length === 7 || str.length === 9)) {
        return false;
    }

    for (let i = 1; i < str.length; i++) {
        const charCode = str.charCodeAt(i);

        if (
            !(charCode >= 48 && charCode <= 57) && // 0-9
            !(charCode >= 65 && charCode <= 70) && // A-F
            !(charCode >= 97 && charCode <= 102) // a-f
        ) {
            return false;
        }
    }

    return true;
}

export async function fetchCreateSmol(url: string): Promise<{ message: string } | {
    short: string,
    smol: string,
}> {
    const fetchUrl = `${origin}/api${URLS.SMOL}/create` as const;
    const data = await (
        await fetch(fetchUrl, {
            method: "POST",
            body: JSON.stringify({ url }),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "same-origin",
        })
    ).json();

    return data;
}

export async function getSessionByToken(sessionToken: string): Promise<Session | null> {
    const prisma = await import("@clfxc/db").then((res) => res.prisma);
    const session = await prisma.session.findFirst({ where: { sessionToken } });
    if (!session) return null;
    return session;
}

export function getRandom(upTo?: number) {
    const random = Math.floor(Math.random() * (upTo ?? 10));
    return random;
}

const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" as const;
export function makeLetterMix(len: number) {
    let mix: string = "";
    for (let i = 0; i < len; i++) {
        const letter = letters[getRandom(letters.length - 1)];
        mix += letter;
    }
    return mix;
}

export async function validateHeadersSession(headers: IncomingHttpHeaders): Promise<Session | null> {
    const getCookieParser = await import("next/dist/server/api-utils").then((res) => res.getCookieParser);
    const cookies = getCookieParser(headers);
    const sessionToken = cookies()["next-auth.session-token"];
    if (!sessionToken) return null;
    const session = await getSessionByToken(sessionToken);
    if (!session || session.expires.getTime() < Date.now()) return null;
    return session;
}
