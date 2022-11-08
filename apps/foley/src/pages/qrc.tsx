import { Input, InputOnChange } from '@clfxc/ui';
import { acceptedFileTypeSchema } from '@declarations/schemas';
import type { NextPage } from 'next';
import { useCallback } from 'react';

// interface Props {}

const QRCodePage: NextPage = () => {
	const handleChange: InputOnChange = useCallback((e) => {
		const { ok, file } = validateFile(e.target.files?.[0]);
		if (!ok) {
			// TODO: add error here
			return;
		}

		// TODO: continue implementation
		console.log('file?', file);
	}, []);

	return (
		<>
			<section className="min-h-screen bg-[var(--clr-bg-300)]">
				<Input type="file" onChange={handleChange} />
			</section>
		</>
	);
};

export default QRCodePage;

type ValidateFileReturn = { file: File; ok: true } | { file?: undefined; ok: false };
function validateFile(file: File | undefined): ValidateFileReturn {
	if (!file) return { ok: false };
	const fileType = acceptedFileTypeSchema.safeParse(file.type);

	if (!fileType.success) {
		console.warn(`invalid file type ${file.type}`);
		return { ok: false };
	}

	// convert bytes to megabytes
	// 1e6 = Math.pow(10, 6) ✌️
	const fileSize = parseFloat((file.size / 1e6).toFixed(6));

	if (fileSize > 3) {
		console.warn(`file too big ${fileSize}mb`);
		return { ok: false };
	}

	return { file, ok: true };
}
