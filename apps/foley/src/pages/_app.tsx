import "@styles/font-faces.scss";
// eslint-disable-next-line import/no-unresolved
import "@styles/globals.scss";
// import '@styles/reset.scss';

import Layout from "@components/Layout/Layout";
import { AppProps } from "next/app";
import type { NextPage } from "next/types";

const KIPRI: NextPage<AppProps> = ({ Component, pageProps }) => {
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
};

export default KIPRI;
