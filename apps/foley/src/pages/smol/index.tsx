import { Button, Input, Spinner } from '@clfxc/ui';
import { URLS } from '@declarations/enums';
import { urlSchema } from '@declarations/schemas';
import styles from '@styles/Index.module.scss';
import { baseUrl } from '@utils/misc';
import type { NextPage } from 'next';
import { ChangeEvent, FormEvent, useCallback, useState, useTransition } from 'react';

// interface Props {}

const SmolPage: NextPage = () => {
	const [isTransition, startTransition] = useTransition();

	const [loading, setLoading] = useState<boolean>(false);
	const [url, setUrl] = useState<string>('');
	const [smol, setSmol] = useState<string>('');

	const handleChangeUrl = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		setUrl(e.target.value);
	}, []);

	const handleMakeSmol = useCallback(
		async (e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			startTransition(() => setLoading(true));

			const parsed = urlSchema.safeParse(url);
			if (!url.length || !parsed.success) {
				console.warn('invalid url');
				setLoading(false);
				return;
			}

			const fetchUrl = `${baseUrl}/api${URLS.SMOL}/create`;
			try {
				const data = await (
					await fetch(fetchUrl, {
						method: 'POST',
						body: JSON.stringify({ url }),
						headers: {
							'Content-Type': 'application/json',
						},
					})
				).json();

				setSmol(data?.smol ?? '');
				setLoading(false);
			} catch (error) {
				setLoading(false);
				console.log('something went wrong', error);
			}
		},
		[url]
	);

	return (
		<section className="grid place-content-center place-items-center gap-6 min-h-screen px-4 bg-[var(--clr-bg-300)]">
			<h1
				style={{ fontSize: 'clamp(7rem, 14vw, 12rem)' }}
				className={`font-underdog text-center text-white ${styles.heading}`}
			>
				make smol
			</h1>
			<Spinner variant="puff" className={`stroke-black ${!loading ? 'hide' : ''}`} />
			<form
				onSubmit={handleMakeSmol}
				className={loading ? 'hide' : 'grid auto-rows-auto gap-8 place-items-center w-full'}
			>
				{Boolean(smol.length) && (
					<>
						<span className="text-center scale-[2]">🚀</span>
						<a
							className="underline text-center text-white font-thin text-lg"
							target="_blank"
							href={'https://' + smol}
							rel="noreferrer"
						>
							{smol}
						</a>
					</>
				)}
				<Input
					style={{ maxWidth: '30rem' }}
					className="w-full bg-[var(--clr-bg-500)] text-white border-4 outline-[var(--clr-orange)] focus:outline-offset-8 focus:outline-dashed"
					value={url}
					onChange={handleChangeUrl}
				/>
				<Button
					type="submit"
					className="border-white text-white hover:bg-[var(--clr-bg-500)] active:text-[var(--clr-turquoise)]"
					disabled={isTransition || loading}
				>
					boop
				</Button>
			</form>
		</section>
	);
};

export default SmolPage;
