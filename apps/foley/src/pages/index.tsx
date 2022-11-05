import { URLS } from '@declarations/enums';
import styles from '@styles/Index.module.scss';
import { NextPage } from 'next';
import Link from 'next/link';

const IndexPage: NextPage = () => {
	return (
		<>
			<section className="grid place-content-center place-items-center gap-2 min-h-screen bg-clr-bg-300">
				<h1
					style={{ color: 'var(--clr-white)', fontSize: '16rem' }}
					className="relative font-londrina-sketch leading-tight"
				>
					KIPRI
					<span className="text-2xl">.dev</span>
				</h1>
				<Link className={`button border-white ${styles.boop}`} href={URLS.REPLACE}>
					BOOP
				</Link>
			</section>
		</>
	);
};

export default IndexPage;
