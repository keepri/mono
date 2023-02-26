import "@styles/globals.scss";
import { Analytics } from "@vercel/analytics/react";

import Layout from "@components/Layout/Layout";
import { AppProps } from "next/app";
import { type NextPage } from "next/types";
import { SessionProvider } from "next-auth/react";

const KIPRI: NextPage<AppProps> = ({ Component, pageProps: { session, ...pageProps } }) => {
    return (
        <>
            <SessionProvider session={session}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </SessionProvider>
            <Analytics />
        </>
    );
};

export default KIPRI;
