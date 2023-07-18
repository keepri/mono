import { z } from "zod";

export const AccountSchema = z.object({
    id: z.string().cuid(),
    userId: z.string().optional(),
    type: z.string(),
    provider: z.string(),
    providerAccountId: z.string(),
    refresh_token: z.string(),
    refresh_token_expires_in: z.string(),
    access_token: z.string().optional(),
    expires_in: z.string().optional(),
    expires_at: z.number().optional(),
    token_type: z.string().optional(),
    scope: z.string().optional(),
    id_token: z.string().optional(),
    session_state: z.string().optional(),
});

export const UserSchema = z.object({
    id: z.string().cuid(),
    name: z.string().optional(),
    email: z.string().email().min(5).max(255).optional(),
    emailVerified: z.date().optional(),
    role: z.enum(["user", "admin"]),
    image: z.string().optional(),
});

export const SessionSchema = z.object({
    id: z.string().cuid(),
    sessionToken: z.string(),
    userId: UserSchema.shape.id,
    expires: z.date(),
});

export const SmolSchema = z.object({
    id: z.string().cuid(),
    userId: UserSchema.shape.id,
    status: z.enum(["active", "inactive"]),
    slug: z.string().length(4),
    url: z.string().min(1).url({ message: "url invalid" }),
    accessed: z.number().nonnegative(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const PostSchema = z.object({
    id: z.string().cuid(),
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    excerpt: z.string(),
    author: z.string(),
    category: z.string(),
    accessed: z.number().nonnegative(),
    ownerId: UserSchema.shape.id.optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const ContactSchema = z.object({
    id: z.string().cuid(),
    userId: UserSchema.shape.id.optional(),
    name: z.string().min(1).max(255).optional(),
    email: z.string().email().min(5).max(255),
    message: z.string().min(1).max(1000),
    createdAt: z.date(),
    updatedAt: z.date(),
});
