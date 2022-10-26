import { Button } from '@clfxc/ui';
import { URLS } from '@declarations/enums';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

const IndexPage: NextPage = () => {
	const { push } = useRouter();
	return (
		<div className="grid place-items-center min-h-screen">
			<Button onClick={() => push(URLS.REPLACE)}>BOOP</Button>
		</div>
	);
};

export default IndexPage;
