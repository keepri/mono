import { z } from "zod";

export enum StatusSmol {
    active = "active",
    inactive = "inactive",
}

export const SmolSchema = z.object({
    id: z.string().cuid(),
    status: z.nativeEnum(StatusSmol),
    slug: z.string().length(4),
    url: z.string().url(),
    accessed: z.number().nonnegative().default(0),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const ErrorStatusSchema = z.union([z.literal(400), z.literal(401), z.literal(404), z.literal(500)]);
export const SuccessStatusSchema = z.union([z.literal(200), z.literal(201)]);

