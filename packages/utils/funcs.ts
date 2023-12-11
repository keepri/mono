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

export function getTextBytes(data: string): number {
    const dataEncoded = new TextEncoder().encode(data);
    const bytes = dataEncoded.BYTES_PER_ELEMENT * dataEncoded.byteLength;

    return bytes;
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

export function randomNumber(max?: number): number {
    const random = Math.floor(Math.random() * (max ?? 10));
    return random;
}

export function makeLetterMix(len: number): string {
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" as const;
    let mix: string = "";
    for (let i = 0; i < len; i++) {
        const letter = letters[randomNumber(letters.length - 1)];
        mix += letter;
    }
    return mix;
}
