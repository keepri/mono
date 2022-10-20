// import '@styles/fontFaces.scss';
// eslint-disable-next-line import/no-unresolved
import '@styles/globals.scss';
// import '@styles/reset.scss';

import Layout from '@components/Layout/Layout';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';

const KIPRI: NextPage<AppProps> = ({ Component, pageProps }) => {
	return (
		<Layout>
			<Component {...pageProps} />
		</Layout>
	);
};

export default KIPRI;
