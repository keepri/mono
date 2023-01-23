import { URLS } from '@declarations/enums';
import Link from 'next/link';
import type { NextPage } from 'next/types';

const IndexPage: NextPage = () => {
	return (
		<main className="grid place-content-center place-items-center gap-4 min-h-screen bg-[var(--clr-bg-300)]">
			<a
				href="mailto:hi@kipri.dev"
				style={{ fontSize: 'clamp(4rem, 20vw, 15rem)' }}
				className="relative text-[var(--clr-white)] font-londrina-sketch leading-tight whitespace-nowrap hover:text-[var(--clr-bg-500)] transition-colors"
			>
				<span className="text-4xl">hi @ </span>
				KIPRI
				<span className="text-4xl"> . dev</span>
			</a>
			<section className="flex gap-4">
				<Link style={{ color: 'white' }} className="button border-white" href={URLS.REPLACE}>
					boop
				</Link>
				<Link style={{ color: 'white' }} className="button border-white" href={URLS.SMOL}>
					smol
				</Link>
				<Link style={{ color: 'white' }} className="button border-white" href={URLS.QR}>
					qr
				</Link>
				<Link style={{ color: 'white' }} className="button border-white" href={URLS.CLOSET}>
					closet
				</Link>
			</section>
		</main>
	);
};

export default IndexPage;
