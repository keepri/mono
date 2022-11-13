import type { QRCode } from '@clfxc/services/qr';
import { makeQRCodeClient, toDataURL } from '@clfxc/services/qr';
import { Button, Input, InputOnChange } from '@clfxc/ui';
import { getTextBytes, readFileAsDataUrl, toKB, validateFile } from '@utils/helpers';
import type { NextPage } from 'next';
import { createRef, MouseEventHandler, useCallback, useMemo, useState } from 'react';
// import { URLS } from '@declarations/enums';
// import { baseUrl } from '@utils/misc';

// interface Props {}

const QRCodePage: NextPage = () => {
	const canvasRef = createRef<HTMLCanvasElement>();

	const [text, setText] = useState<string>('');
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [code, setCode] = useState<QRCode | null>(null);

	const fileSize = useMemo(() => toKB(selectedFile?.size ?? -1), [selectedFile]);

	const makeCode = useCallback(
		async (data: string) => {
			if (!canvasRef.current) return;

			try {
				const { ok, code: newCode, error } = await makeQRCodeClient(data);

				// TODO: SERVER SIDE CREATION - not working
				// const qrRes = await fetch(`${baseUrl}${URLS.API_QR_CREATE}`, {
				// 	method: 'POST',
				// 	headers: {
				// 		'Content-Type': 'application/json',
				// 	},
				// 	body: JSON.stringify({ data }),
				// });

				if (!ok) {
					console.warn('failed making qr code', error);
					return;
				}

				// const { code: newCode } = (await qrRes.json()) as { code: QRCode };

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
		},
		[canvasRef]
	);

	const handleChangeFile: InputOnChange = useCallback((e) => {
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

	const handleChangeInput: InputOnChange = useCallback((e) => {
		setText(e.target.value);
	}, []);

	const handleSubmit: MouseEventHandler<HTMLButtonElement> = useCallback(() => {
		// no file has been uploaded
		if (!selectedFile) {
			if (!Boolean(text.length)) return;
			const bytes = getTextBytes(text);
			if (bytes > 2953) return;

			makeCode(text);
			return;
		}

		// handle file uploaded creation
		readFileAsDataUrl(selectedFile, async (e) => {
			const data = e.target?.result as string;
			if (!data) return;
			makeCode(data);
		});
	}, [selectedFile, text, makeCode]);

	return (
		<>
			<section className="flex flex-col items-center justify-center gap-8 px-2 min-h-screen bg-[var(--clr-bg-300)]">
				<p className={`text-3xl ${!code ? 'invisible' : ''}`}>🚀</p>

				<div className={`flex items-center justify-center w-[150px] h-[150px] ${!code ? 'invisible' : ''}`}>
					<canvas ref={canvasRef} width={150} height={150} className="rounded max-w-[150px] max-h-[150px]" />
				</div>

				<Input
					placeholder="gib text, link or good vibes"
					value={text}
					className="max-w-[30rem] w-full bg-[var(--clr-bg-500)] text-white border-4 outline-[var(--clr-orange)] focus:outline-offset-8 focus:outline-dashed"
					onChange={handleChangeInput}
				/>

				<div aria-label="buttons" className="flex flex-wrap items-center justify-center gap-4">
					<Input
						type="file"
						// TODO: TEMP: hidden due to not being done
						labelclass="hidden text-white font-nixie-one hover:bg-[var(--clr-bg-500)] hover:border-[var(--clr-orange)] active:bg-[var(--clr-orange)] active:border-[var(--clr-bg-500)] active:text-white active:scale-110"
						onChange={handleChangeFile}
					/>

					<Button className="button border-white text-white" onClick={handleSubmit}>
						boop
					</Button>
				</div>

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
			</section>
		</>
	);
};

export default QRCodePage;
