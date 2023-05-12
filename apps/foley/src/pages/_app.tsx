import Layout from "@components/Layout/Layout";
import "@styles/globals.scss";
import { isProduction } from "@utils/misc";
import { Analytics } from "@vercel/analytics/react";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";

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
