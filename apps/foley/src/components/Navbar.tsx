import { Link } from "ui/components/Link";
import { URLS } from "@utils/enums";
import Auth from "./Auth";
import { useRouter } from "next/router";
import { fontInconsolata, fontLondrinaSketch } from "@utils/font";
import Section from "./Section";

export default function Navbar(): JSX.Element {
    const router = useRouter();
    const linkClasses = `px-2 dark:text-white hover:!text-[var(--clr-orange)] hover:underline ${fontInconsolata}`;
    const linkActiveClasses = "!text-[var(--clr-orange)] underline";

    return (
        <nav className={`${fontInconsolata} sticky top-0 flex items-center py-2 bg-ivory dark:bg-black z-10`}>
            <Section className="flex flex-wrap items-center max-sm:justify-around gap-6">
                <Logo />

                <section className="flex flex-wrap justify-center gap-4 px-4">
                    <Link

                        active={router.route === URLS.QR}
                        href={URLS.QR}
                        activeClassName={linkActiveClasses}
                        className={linkClasses}
                    >
                        qr
                    </Link>

                    <Link
                        active={router.route === URLS.SMOL}
                        href={URLS.SMOL}
                        activeClassName={linkActiveClasses}
                        className={linkClasses}
                    >
                        smol
                    </Link>

                    {
                        // <Link
                        //     active={router.route === URLS.REPLACE}
                        //     href={URLS.REPLACE}
                        //     activeClassName={linkActiveClasses}
                        //     className={linkClasses}
                        // >
                        //     replace
                        // </Link>
                    }

                    {
                        // <Link
                        //     active={router.route === URLS.BLOG}
                        //     href={URLS.BLOG}
                        //     activeClassName={linkActiveClasses}
                        //     className={linkClasses}
                        // >
                        //     blog
                        // </Link>

                    }
                </section>

                <Auth className="sm:ml-auto" />
            </Section>
        </nav>
    );
}

function Logo(): JSX.Element {
    return (
        <Link href={URLS.HOME}>
            <h1 className={`text-6xl leading-none dark:text-white hover:!text-[var(--clr-orange)] ${fontLondrinaSketch}`}>
                K
            </h1>
        </Link>
    );
}
