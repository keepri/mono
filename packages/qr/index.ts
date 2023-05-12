import { create, type QRCode } from "qrcode";
export { toDataURL, toFile, type QRCodeToDataURLOptions, type QRCodeToFileOptions } from "qrcode";
export { create, type QRCode };

export function makeCode(data: string): QRCode {
    if (typeof window === "undefined") throw new Error("TypeError window");
    if (typeof data !== "string") throw new Error("invalid data passed to makeCode");
    return create(data);
}
