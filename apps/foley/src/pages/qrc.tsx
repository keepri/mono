import type { QRCode } from '@clfxc/services/qr';
import { makeQRCode, toDataURL } from '@clfxc/services/qr';
import { Button, Input, InputOnChange } from '@clfxc/ui';
import { readFileAsDataUrl, toKB, validateFile } from '@utils/helpers';
import type { NextPage } from 'next';
import { createRef, MouseEventHandler, useCallback, useMemo, useState } from 'react';

// interface Props {}

const QRCodePage: NextPage = () => {
	const canvasRef = createRef<HTMLCanvasElement>();

	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [code, setCode] = useState<QRCode | null>(null);

	const fileSize = useMemo(() => toKB(selectedFile?.size ?? -1), [selectedFile]);

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

		setSelectedFile(file);
	}, []);

	const handleMakeCode: MouseEventHandler<HTMLButtonElement> = useCallback(() => {
		// no file has been uploaded
		if (!selectedFile) {
			return;
		}

		// handle file uploaded creation
		readFileAsDataUrl(selectedFile, async (e) => {
			const data = e.target?.result as string;

			if (!data || !canvasRef.current) return;

			try {
				const { ok, code: newCode, error } = await makeQRCode(data);

				if (!ok) {
					console.warn('failed making qr code', error);
					return;
				}

				toDataURL(
					canvasRef.current,
					newCode.segments.map((segment) => ({ ...segment, mode: segment.mode.id })),
					(err) => {
						if (err) {
							const { message, stack } = err;
							console.log('could not create code image', { message, stack });
							return;
						}
					}
				);

				setCode(newCode);
			} catch (error) {
				console.error(error);
			}
		});
	}, [selectedFile, canvasRef]);

	return (
		<>
			<section className="grid place-items-center place-content-center gap-8 min-h-screen bg-[var(--clr-bg-300)]">
				<canvas ref={canvasRef} className={`${!code ? 'invisible' : ''}`} />

				<p
					className={`flex flex-wrap items-center justify-center gap-4 text-white text-center max-w-[40ch] text-xs sm:max-w-[unset] ${
						!selectedFile ? 'invisible' : ''
					}`}
				>
					{selectedFile?.name}{' '}
					<span className="px-2 py-2 ml-4 rounded bg-[var(--clr-orange)]">{selectedFile?.type.split('/')[1]}</span>
					<span className="px-2 py-2 rounded bg-[var(--clr-orange)]">
						{fileSize.toFixed(2)}kB {fileSize > 1000 ? '🚀' : ''}
					</span>
				</p>

				<div aria-label="buttons" className="flex flex-wrap gap-4">
					<Input
						type="file"
						labelclass="text-white font-nixie-one hover:bg-[var(--clr-bg-500)] hover:border-[var(--clr-orange)] active:bg-[var(--clr-orange)] active:border-[var(--clr-bg-500)] active:text-white active:scale-110"
						className=""
						onChange={handleChange}
					/>

					<Button className="button border-white text-white" onClick={handleMakeCode}>
						boop
					</Button>
				</div>
			</section>
		</>
	);
};

export default QRCodePage;
