import { z } from "zod";
import { FileType, ImageType } from "./enums";
import { ContactSchema } from "db/schemas";

export const ImageTypeSchema = z.nativeEnum(ImageType);
export const FileTypeSchema = z.nativeEnum(FileType);
export const AcceptedFileTypeSchema = ImageTypeSchema.or(FileTypeSchema);

export const ContactBodySchema = ContactSchema.pick({
    userId: true,
    name: true,
    email: true,
    message: true,
});
