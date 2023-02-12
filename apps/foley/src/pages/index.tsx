import { Link } from "@clfxc/ui/components/Link";
import { URLS } from "@declarations/enums";
import { londrinaSketch, nixieOne } from "@utils/misc";
import type { NextPage } from "next/types";

const IndexPage: NextPage = () => {
    return (
        <main className="grid place-content-center place-items-center gap-4 min-h-screen bg-[var(--clr-bg-300)]">
            <a
                href="mailto:hi@kipri.dev"
                style={{ fontSize: "clamp(3rem, 17vw, 15rem)" }}
                className={`relative text-[var(--clr-white)] text-center px-4 ${londrinaSketch.variable} font-londrina-sketch leading-none sm:whitespace-nowrap hover:text-[var(--clr-bg-500)] transition-colors max-[290px]:max-w-[8rem]`}
            >
                <span className="text-4xl max-[290px]:leading-none leading-none">hi @ </span>
                KIPRI
                <span className="text-4xl max-[290px]:leading-none leading-none"> . dev</span>
            </a>
            <section className="flex flex-wrap justify-center gap-4">
                <Link style={{ color: "white" }} className={`button border-white ${nixieOne.variable} font-nixie-one`} href={URLS.REPLACE}>
                    replace
                </Link>
                <Link style={{ color: "white" }} className={`button border-white ${nixieOne.variable} font-nixie-one`} href={URLS.SMOL}>
                    smol
                </Link>
                <Link style={{ color: "white" }} className={`button border-white ${nixieOne.variable} font-nixie-one`} href={URLS.QR}>
                    qr
                </Link>
            </section>
        </main>
    );
};

export default IndexPage;
