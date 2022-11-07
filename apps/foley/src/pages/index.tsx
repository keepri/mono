import { URLS } from '@declarations/enums';
import styles from '@styles/Index.module.scss';
import { NextPage } from 'next';
import Link from 'next/link';

const IndexPage: NextPage = () => {
	return (
		<main className="grid place-content-center place-items-center gap-4 min-h-screen bg-[var(--clr-bg-300)]">
			<a
				href="mailto:hi@kipri.dev"
				style={{ fontSize: 'clamp(4rem, 20vw, 15rem)' }}
				className="relative text-[var(--clr-white)] font-londrina-sketch leading-tight whitespace-nowrap hover:text-[var(--clr-bg-500)]"
			>
				<span className="text-4xl">hi @ </span>
				KIPRI
				<span className="text-4xl"> . dev</span>
			</a>
			<section className="flex gap-4">
				<Link className={`button border-white ${styles.boop}`} href={URLS.REPLACE}>
					boop
				</Link>
				<Link className={`button border-white ${styles.boop}`} href={URLS.SMOL}>
					smol
				</Link>
			</section>
		</main>
	);
};

export default IndexPage;
