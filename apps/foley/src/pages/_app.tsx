import "@total-typescript/ts-reset";
import Layout from "@components/Layout/Layout";
import "@styles/globals.scss";
import { StorageKey } from "@utils/enums";
import { BrowserStorage } from "@utils/helpers";
import { isProduction } from "@utils/misc";
import { Analytics } from "@vercel/analytics/react";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { useEffect } from "react";

export default function KIPRI({ Component, pageProps: { session, ...pageProps } }: AppProps): JSX.Element {
    colorSchemeHandler();

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

function colorSchemeHandler() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useEffect(() => {
        handleColorSchemeChange();

        const colorSchemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        colorSchemeMediaQuery.addEventListener("change", handleColorSchemeChange);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("storage", handleLocalStorageChange);
        window.addEventListener("storagechange", function handleThemeChange() { handleColorSchemeChange(); });

        function handleColorSchemeChange(): void {
            const theme = BrowserStorage.get(StorageKey.theme);

            if (theme === "light") {
                document.documentElement.classList.add("bg-ivory");
                document.documentElement.classList.remove("dark", "bg-black");
            } else if (
                (theme === "dark" && !document.documentElement.classList.contains("dark")) ||
                (window.matchMedia("(prefers-color-scheme: dark)").matches && !document.documentElement.classList.contains("dark"))
            ) {
                document.documentElement.classList.add("dark", "bg-black");
                document.documentElement.classList.remove("bg-ivory");
            } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
                document.documentElement.classList.add("bg-ivory");
                document.documentElement.classList.remove("dark", "bg-black");
            }

        }

        function handleVisibilityChange(): void {
            if (document.visibilityState === "visible") {
                handleColorSchemeChange();
            }
        }

        function handleLocalStorageChange(e: StorageEvent): void {
            if (e.storageArea === localStorage && e.key === StorageKey.theme) {
                handleColorSchemeChange();
            }
        }

        return () => {
            colorSchemeMediaQuery.removeEventListener("change", handleColorSchemeChange);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("storage", handleLocalStorageChange);
            window.removeEventListener("storagechange", function handleThemeChange() { handleColorSchemeChange(); });
        };
    }, []);
}
