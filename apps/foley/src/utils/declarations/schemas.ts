import { z } from 'zod';
import { FileType, ImageType } from './enums';

export const urlSchema = z.string().min(1).url({ message: 'url invalid' });
export const imageTypeSchema = z.nativeEnum(ImageType);
export const fileTypeSchema = z.nativeEnum(FileType);
export const acceptedFileTypeSchema = imageTypeSchema.or(fileTypeSchema);
