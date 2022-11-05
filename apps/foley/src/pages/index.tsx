import { URLS } from '@declarations/enums';
import { NextPage } from 'next';
import Link from 'next/link';

const IndexPage: NextPage = () => {
	return (
		<>
			<section className="grid place-content-center place-items-center gap-2 min-h-screen">
				<h1 className="relative font-londrina-sketch text-9xl leading-tight">
					KIPRI
					<span className="text-2xl">.dev</span>
				</h1>
				<Link className="button" href={URLS.REPLACE}>
					BOOP
				</Link>
			</section>
		</>
	);
};

export default IndexPage;
