import { type Session, type Smol, Prisma, Role, User } from "db";
import { SmolSchema } from "db/schemas";
import { toMB } from "utils";
import { FileType, ImageType, RoleName, StorageKey, URLS } from "@utils/enums";
import { AcceptedFileTypeSchema } from "@utils/schemas";
import { IncomingHttpHeaders } from "http";
import { ZodError, z } from "zod";
import { origin } from "./misc";
import { BodySchema as CreateSmolBodySchema } from "pages/api/smol/create";
import { parseCookie } from "next/dist/compiled/@edge-runtime/cookies";

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
    const prisma = (await import("db")).prisma;
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
    const res = await fetch(origin + URLS.API_SMOL + "/" + slug);

    if (res.status !== 200) {
        throw new Error(await res.text());
    }

    const smol = (await res.json()) as PickedSmol;

    if (smol.status !== "active") {
        throw new Error("not active");
    }

    return smol;
}

export async function getSmolBySlug$(slug: string): Promise<PickedSmol> {
    const prisma = (await import("db")).prisma;
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
    const headers = new Headers();
    headers.set("Content-Type", "application/json");

    const res = await fetch(origin + URLS.API_SMOL_CREATE, {
        method: "POST",
        body: JSON.stringify({
            url,
        } satisfies z.infer<typeof CreateSmolBodySchema>),
        headers,
        credentials: "same-origin",
    });
    const result = await res.text();

    if (res.status !== 200) {
        throw new Error(result);
    }

    return result;
}

export async function getSessionByToken$(sessionToken: string): Promise<Session | null> {
    const prisma = await import("db").then((res) => res.prisma);
    const session = await prisma.session.findFirst({ where: { sessionToken } });

    if (!session) return null;

    return session;
}

export async function validateSession$(headers: IncomingHttpHeaders): Promise<Session | null> {
    const cookieHeader = headers.cookie || headers.Cookie;
    const cookies = parseCookie(cookieHeader as string);
    const sessionToken = cookies.get("__Secure-next-auth.session-token") || cookies.get("next-auth.session-token");

    if (!sessionToken) {
        return null;
    }

    const session = await getSessionByToken$(sessionToken);

    if (!session) {
        return null;
    }

    return session;
}

export class BrowserStorage {
    private static isSupported: boolean = typeof Storage === "function";

    static get(key: StorageKey): string | null {
        if (!BrowserStorage.isSupported) {
            return null;
        }

        return localStorage.getItem(key);
    }

    static set(key: StorageKey, value: string): void {
        if (!BrowserStorage.isSupported) {
            return void 0;
        }

        localStorage.setItem(key, value);
        window.dispatchEvent(new CustomEvent("storagechange"));
        return;
    }

    static remove(key: StorageKey): void {
        if (!BrowserStorage.isSupported) {
            return void 0;
        }

        localStorage.removeItem(key);
        window.dispatchEvent(new CustomEvent("storagechange"));
        return;
    }
}

export class RoleManager {
    static async getById(id: Role["id"], options?: { select?: Prisma.RoleSelect }) {
        const prisma = (await import("db")).prisma;
        const role = await prisma.role.findFirst({ where: { id }, select: options?.select });

        return role;
    }

    static async getByIdOrThrow(id: Role["id"], options?: { select?: Prisma.RoleSelect }) {
        const prisma = (await import("db")).prisma;
        const role = await prisma.role.findFirstOrThrow({ where: { id }, select: options?.select });

        return role;
    }

    static async getByName(name: RoleName, options?: { select?: Prisma.RoleSelect }) {
        const prisma = (await import("db")).prisma;
        const role = await prisma.role.findFirst({ where: { name }, select: options?.select });

        return role;
    }

    static async getByNameOrThrow(name: RoleName, options?: { select?: Prisma.RoleSelect }) {
        const prisma = (await import("db")).prisma;
        const role = await prisma.role.findFirstOrThrow({ where: { name }, select: options?.select });

        return role;
    }

    static async getUserRoles(id: User["id"]): Promise<Array<RoleName>> {
        const prisma = (await import("db")).prisma;
        const roleList = await prisma.user_role.findMany({
            where: { userId: id },
            include: { role: { select: { name: true } } },
        });

        const roleNameList = Array(roleList.length) as Array<RoleName>;
        for (let i = 0; i < roleNameList.length; ++i) {
            roleNameList[i] = roleList[i].role.name as RoleName;
        }

        return roleNameList;
    }

    static async assign(id: number, name: RoleName): Promise<void> {
        const prisma = (await import("db")).prisma;
        const role = await this.getByNameOrThrow(name, { select: { id: true } });
        const userRole = await prisma.user_role.findFirst({ where: { userId: id, roleId: role.id } });

        if (!userRole) {
            await prisma.user_role.create({ data: { userId: id, roleId: role.id! } });
            console.log(`assigned user ${id} the role of ${name}`);
        }

        return void 0;
    }

    static async isAdmin(id: number): Promise<boolean> {
        const prisma = (await import("db")).prisma;
        const adminRole = await this.getByNameOrThrow(RoleName.admin, { select: { id: true } });
        const userAdminRole = await prisma.user_role.findFirst({
            where: {
                userId: id,
                roleId: adminRole.id,
            },
            select: {},
        });

        return Boolean(userAdminRole);
    }
}
