import { acceptedFileTypeSchema } from '@declarations/schemas';
import { ValidateFileReturn } from '@declarations/types';

export function validateFile(file: File | undefined, maxFileSize?: number): ValidateFileReturn {
	if (!file) return { ok: false };
	const fileType = acceptedFileTypeSchema.safeParse(file.type);

	if (!fileType.success) {
		console.warn(`invalid file type`);
		return { ok: false, error: fileType.error };
	}

	// convert bytes to megabytes
	// 1e6 = Math.pow(10, 6) ✌️
	const fileSize = parseFloat((file.size / 1e6).toFixed(6));

	if (fileSize >= (maxFileSize ?? 3)) {
		console.warn(`file too big ${fileSize}mb`);
		return { ok: false, error: 'file too big' };
	}

	return { file, ok: true };
}
