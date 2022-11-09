import { Input, InputOnChange } from '@clfxc/ui';
import { validateFile } from '@utils/helpers';
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
