import "@styles/globals.scss";
import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";
import Layout from "@components/Layout/Layout";
import { isProduction } from "@utils/misc";

export default function KIPRI({ Component, pageProps: { session, ...pageProps } }: AppProps): JSX.Element {
    return (
        <>
            <SessionProvider session={session}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </SessionProvider>
            <Analytics debug={isProduction} />
        </>
    );
}
