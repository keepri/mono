import { Session, Smol } from "@clfxc/db";
import { SmolSchema } from "@clfxc/db/schemas";
import { toMB } from "@clfxc/utils";
import { FileType, ImageType, URLS } from "@utils/enums";
import { AcceptedFileTypeSchema } from "@utils/schemas";
import { IncomingHttpHeaders } from "http";
import { ZodError, z } from "zod";
import { origin } from "./misc";
import { BodySchema as CreateSmolBodySchema } from "pages/api/smol/create";

export function validateFile(
    file: File | undefined,
    maxFileSize?: number
):
    | { file: File; ok: true; error?: undefined }
    | { file?: undefined; ok: false; error?: ZodError<ImageType | FileType> | "file too big" } {
    if (!file) return { ok: false };

    const fileType = AcceptedFileTypeSchema.safeParse(file.type);

    if (!fileType.success) {
        console.warn("invalid file type");
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

export async function incrementSmolAccessed$(id: Smol["id"]): Promise<void> {
    const prisma = (await import("@clfxc/db")).prisma;
    const update = await prisma.smol.update({
        where: { id },
        select: { accessed: true, slug: true },
        data: { accessed: { increment: 1 } },
    });

    console.log(`smol ${update.slug} was accessed ${update.accessed} times`);
}

const PickedSmolSchema = SmolSchema.pick({ status: true, url: true, id: true, accessed: true });
export type PickedSmol = z.infer<typeof PickedSmolSchema>;
export async function fetchSmolBySlug(slug: string): Promise<PickedSmol> {
    const res = await fetch(`${origin}${URLS.API_SMOL}/${slug}`);

    if (res.status !== 200) {
        throw new Error(await res.text());
    }

    const smol = await res.json() as PickedSmol;

    if (smol.status !== "active") {
        throw new Error("not active");
    }

    return smol;
}

export async function getSmolBySlug$(slug: string): Promise<PickedSmol> {
    const prisma = (await import("@clfxc/db")).prisma;
    const smol = await prisma.smol.findFirst({
        where: { slug: { equals: slug } },
        select: { status: true, url: true, id: true, accessed: true },
    });

    if (!smol) {
        throw new Error("not found Sadge");
    }

    await incrementSmolAccessed$(smol.id);

    if (smol.status !== "active") {
        throw new Error("smol not active");
    }

    return smol as PickedSmol;
}

export async function fetchCreateSmol(url: string): Promise<Smol["url"]> {
    const res = await fetch(`${origin}${URLS.API_SMOL_CREATE}`, {
        method: "POST",
        body: JSON.stringify({
            url,
        } satisfies z.infer<typeof CreateSmolBodySchema>),
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "same-origin",
    });
    const result = await res.text();

    if (res.status !== 200) {
        throw new Error(result);
    }

    return result;
}

export async function getSessionByToken$(sessionToken: string): Promise<Session | null> {
    const prisma = await import("@clfxc/db").then((res) => res.prisma);
    const session = await prisma.session.findFirst({ where: { sessionToken } });

    if (!session) return null;

    return session;
}

export async function validateSessionApiRequest(headers: IncomingHttpHeaders): Promise<Session | null> {
    const getCookieParser = await import("next/dist/server/api-utils").then((res) => res.getCookieParser);
    const cookies = getCookieParser(headers)();
    const sessionToken = cookies["__Secure-next-auth.session-token"] || cookies["next-auth.session-token"];

    if (!sessionToken) {
        return null;
    }

    const session = await getSessionByToken$(sessionToken);

    if (!session) {
        return null;
    }

    return session;
}
