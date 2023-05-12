import { z } from "zod";
import { FileType, ImageType } from "./enums";

export const UrlSchema = z.string().min(1).url({ message: "url invalid" });
export const ImageTypeSchema = z.nativeEnum(ImageType);
export const FileTypeSchema = z.nativeEnum(FileType);
export const AcceptedFileTypeSchema = ImageTypeSchema.or(FileTypeSchema);
