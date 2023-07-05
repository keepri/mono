import { z } from "zod";

export const SmolSchema = z.object({
    id: z.string().cuid(),
    userId: z.string(),
    status: z.enum(["active", "inactive"]),
    slug: z.string().length(4),
    url: z.string().url(),
    accessed: z.number().nonnegative(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const SessionSchema = z.object({
    id: z.string().cuid(),
    sessionToken: z.string(),
    userId: z.string(),
    expires: z.date(),
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
    ownerId: z.string().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

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
    name: z.string(),
    email: z.string().email(),
    emailVerified: z.date().optional(),
    image: z.string().optional(),
    accounts: z.array(AccountSchema),
    sessions: z.array(SessionSchema),
    smols: z.array(SmolSchema),
    posts: z.array(PostSchema),
});


