import { createQRCode, QRCode } from "@clfxc/services/qr";
import { acceptedFileTypeSchema } from "@declarations/schemas";
import { ValidateFileReturn } from "@declarations/types";

export function validateFile(file: File | undefined, maxFileSize?: number): ValidateFileReturn {
    if (!file) return { ok: false };
    const fileType = acceptedFileTypeSchema.safeParse(file.type);

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
