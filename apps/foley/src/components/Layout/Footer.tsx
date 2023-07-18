import { GitHub } from "ui";
import { Link } from "ui/components/Link";
import { Section } from "@components/Section";
import { StorageKey, URLS } from "@utils/enums";
import { fontJua, fontLondrinaSketch } from "@utils/font";
import { BrowserStorage } from "@utils/helpers";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Balancer } from "react-wrap-balancer";

export default function Footer(): JSX.Element {
    const router = useRouter();

    return (
        <footer className="py-12 bg-ivory dark:bg-black">
            <Section className="grid xs:grid-cols-3 gap-8 mb-6 items-start dark:text-white">
                <div>
                    <h4 className={`mb-2 text-lg font-medium ${fontJua}`}>Pages</h4>

                    <Link
                        href={URLS.HOME}
                        className={`block py-1 ${router.pathname === URLS.HOME ? "underline" : ""} dark:text-white hover:!text-[var(--clr-orange)]`}
                    >
                        home
                    </Link>

                    <Link
                        href={URLS.QR}
                        className={`block py-1 ${router.pathname === URLS.QR ? "underline" : ""} dark:text-white hover:!text-[var(--clr-orange)]`}
                    >
                        qr
                    </Link>

                    <Link
                        href={URLS.SMOL}
                        className={`block py-1 ${router.pathname === URLS.SMOL ? "underline" : ""} dark:text-white hover:!text-[var(--clr-orange)]`}
                    >
                        smol
                    </Link>
                </div>

                <div>
                    <h4 className={`mb-2 text-lg font-medium ${fontJua}`}>Links</h4>

                    <a
                        href="https://github.com/keepri"
                        className="group flex gap-1 items-center py-1 dark:text-white hover:!text-[var(--clr-orange)] leading-none"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <GitHub width="17px" className="dark:fill-white group-hover:fill-[var(--clr-orange)]" />
                        github/keepri
                    </a>
                </div>

                <div>
                    <h4 className={`mb-2 text-lg font-medium ${fontJua}`}>Contact</h4>

                    <Link button href={`${URLS.HOME}#contact`} className="button block text-center border-gray-400 bg-white dark:bg-black">
                        let&apos;s talk
                    </Link>
                </div>
            </Section>

            <Section className="flex max-xs:flex-col items-center max-xs:justify-center gap-6 min-h-[2.5rem] dark:text-white">
                <span className="flex items-center max-xs:justify-center gap-6">
                    <Link href={URLS.HOME} className={`text-4xl hover:text-[var(--clr-orange)] ${fontLondrinaSketch}`}>
                        K
                    </Link>

                    <p className="text-xs text-center font-extralight leading-none">
                        <Balancer>
                            Copyright © 2023 KIPRI. All rights reserved.
                        </Balancer>
                    </p>
                </span>

                <DarkModeToggler className="xs:ml-auto" />
            </Section>
        </footer>
    );
}

function DarkModeToggler(props: { className?: string }): JSX.Element {
    const theme = BrowserStorage.get(StorageKey.theme);

    const [isClient, setIsClient] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const handleChange = useCallback((newTheme: string) => {
        switch (newTheme) {
            case "dark":
                BrowserStorage.set(StorageKey.theme, "dark");
                break;

            case "light":
                BrowserStorage.set(StorageKey.theme, "light");
                break;

            case "system":
                BrowserStorage.remove(StorageKey.theme);
                break;

            default:
                break;
        }

        setOpen(false);
    }, []);

    useEffect(() => setIsClient(true), []);

    if (!open && isClient) {
        return (
            <div
                className={`${props.className ?? ""} px-2 py-1`}
                onClick={setOpen.bind(setOpen, true)}
            >
                {theme === "light" ? (
                    <span className="group flex items-center gap-2 cursor-pointer hover:text-[var(--clr-orange)] text-sm">
                        Light
                        <LightSvg />
                    </span>
                ) : theme === "dark" ? (
                    <span className="group flex items-center gap-2 cursor-pointer hover:text-[var(--clr-orange)] text-sm">
                        Dark
                        <DarkSvg />
                    </span>
                ) : (
                    <span className="group flex items-center gap-2 cursor-pointer hover:text-[var(--clr-orange)] text-sm">
                        System
                        <MonitorSvg />
                    </span>
                )}
            </div>
        );
    }

    return (
        <div className={!open ? "hidden" : `${props.className ?? ""} relative h-8 w-24`}>
            <div
                className="absolute bottom-0 right-0 flex flex-col gap-1 px-4 py-2 bg-white dark:bg-black border border-slate-400 dark:border-white rounded-md"
            >
                <span
                    className="group flex items-center gap-2 cursor-pointer hover:text-[var(--clr-orange)]"
                    onClick={handleChange.bind(handleChange, "dark")}
                >
                    <DarkSvg />
                    Dark
                </span>

                <span
                    className="group flex items-center gap-2 cursor-pointer hover:text-[var(--clr-orange)]"
                    onClick={handleChange.bind(handleChange, "light")}
                >
                    <LightSvg />
                    Light
                </span>

                <span
                    className="group flex items-center gap-2 cursor-pointer hover:text-[var(--clr-orange)]"
                    onClick={handleChange.bind(handleChange, "system")}
                >
                    <MonitorSvg />
                    System
                </span>
            </div>
        </div>
    );
}

function DarkSvg(): JSX.Element {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="group w-7 h-7">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.715 15.15A6.5 6.5 0 0 1 9 6.035C6.106 6.922 4 9.645 4 12.867c0 3.94 3.153 7.136 7.042 7.136 3.101 0 5.734-2.032 6.673-4.853Z"
            />

            <path
                d="m17.715 15.15.95.316a1 1 0 0 0-1.445-1.185l.495.869ZM9 6.035l.846.534a1 1 0 0 0-1.14-1.49L9 6.035Zm8.221 8.246a5.47 5.47 0 0 1-2.72.718v2a7.47 7.47 0 0 0 3.71-.98l-.99-1.738Zm-2.72.718A5.5 5.5 0 0 1 9 9.5H7a7.5 7.5 0 0 0 7.5 7.5v-2ZM9 9.5c0-1.079.31-2.082.845-2.93L8.153 5.5A7.47 7.47 0 0 0 7 9.5h2Zm-4 3.368C5 10.089 6.815 7.75 9.292 6.99L8.706 5.08C5.397 6.094 3 9.201 3 12.867h2Zm6.042 6.136C7.718 19.003 5 16.268 5 12.867H3c0 4.48 3.588 8.136 8.042 8.136v-2Zm5.725-4.17c-.81 2.433-3.074 4.17-5.725 4.17v2c3.552 0 6.553-2.327 7.622-5.537l-1.897-.632Z"
                className="fill-slate-600 dark:fill-white group-hover:fill-[var(--clr-orange)]"
            />

            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17 3a1 1 0 0 1 1 1 2 2 0 0 0 2 2 1 1 0 1 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 2 2 0 0 0-2-2 1 1 0 1 1 0-2 2 2 0 0 0 2-2 1 1 0 0 1 1-1Z"
                className="fill-slate-600 dark:fill-white group-hover:fill-[var(--clr-orange)]"
            />
        </svg>
    );
}

function LightSvg(): JSX.Element {
    return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group w-7 h-7">
            <path
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                className="stroke-slate-600 dark:stroke-white group-hover:stroke-[var(--clr-orange)]"
            />

            <path
                d="M12 4v1M17.66 6.344l-.828.828M20.005 12.004h-1M17.66 17.664l-.828-.828M12 20.01V19M6.34 17.664l.835-.836M3.995 12.004h1.01M6 6l.835.836"
                className="stroke-slate-600 dark:stroke-white group-hover:stroke-[var(--clr-orange)]"
            />
        </svg>
    );
}

function MonitorSvg(): JSX.Element {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="group w-7 h-7">
            <path
                d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z"
                strokeWidth="2"
                strokeLinejoin="round"
                className="stroke-slate-600 dark:stroke-white group-hover:stroke-[var(--clr-orange)]"
            />

            <path d="M14 15c0 3 2 5 2 5H8s2-2 2-5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-slate-600 dark:stroke-white group-hover:stroke-[var(--clr-orange)]"
            />
        </svg>
    );
}
