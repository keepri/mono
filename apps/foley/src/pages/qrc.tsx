import { makeQRCode, QRCode } from '@clfxc/services/qr';
import { Input, InputOnChange } from '@clfxc/ui';
import { validateFile } from '@utils/helpers';
import type { NextPage } from 'next';
import { useCallback, useState } from 'react';

// interface Props {}

const QRCodePage: NextPage = () => {
	const [code, setCode] = useState<QRCode | null>(null);

	const handleChange: InputOnChange = useCallback((e) => {
		const maxFileSize = 3;
		const { ok, file, error } = validateFile(e.target.files?.[0], maxFileSize);

		if (!ok) {
			console.warn('invalid file', error);

			if (error === 'file too big') {
				// TODO: handle file too big error
				return;
			}

			// TODO: add error here
			return;
		}

		const reader = new FileReader();

		reader.readAsDataURL(file);
		reader.onload = async (e) => {
			const data = e.target?.result as string;
			if (!data) return;

			try {
				const { ok, code: newCode, error } = await makeQRCode(data);

				if (!ok) {
					console.warn('failed making qr code', error);
					return;
				}

				setCode(newCode);
			} catch (error) {
				console.error(error);
			}
		};
	}, []);

	return (
		<>
			<section className="min-h-screen bg-[var(--clr-bg-300)]">
				<p>{JSON.stringify(code)}</p>

				<Input type="file" onChange={handleChange} />
			</section>
		</>
	);
};

export default QRCodePage;
