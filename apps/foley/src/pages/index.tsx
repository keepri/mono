import { Button } from '@clfxc/ui';
import { URLS } from '@declarations/enums';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

const IndexPage: NextPage = () => {
	const { push } = useRouter();
	return (
		<>
			<section className="grid place-content-center place-items-center gap-2 min-h-screen">
				<h1 className="relative font-londrina-sketch text-9xl leading-tight">
					KIPRI
					<span className="text-2xl">.dev</span>
				</h1>
				<Button className="" onClick={() => push(URLS.REPLACE)}>
					BOOP
				</Button>
			</section>
		</>
	);
};

export default IndexPage;
