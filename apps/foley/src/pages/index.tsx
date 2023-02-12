import { URLS } from "@declarations/enums";
import { londrinaSketch } from "@utils/misc";
import Link from "next/link";
import type { NextPage } from "next/types";

const IndexPage: NextPage = () => {
    return (
        <main className="grid place-content-center place-items-center gap-4 min-h-screen bg-[var(--clr-bg-300)]">
            <a
                href="mailto:hi@kipri.dev"
                style={{ fontSize: "clamp(3rem, 17vw, 15rem)" }}
                className={`relative text-[var(--clr-white)] text-center px-4 ${londrinaSketch.variable} font-londrina-sketch max-[290px]:leading-none leading-tight sm:whitespace-nowrap hover:text-[var(--clr-bg-500)] transition-colors max-[290px]:max-w-[8rem]`}
            >
                <span className="text-4xl max-[290px]:leading-none leading-tight">hi @ </span>
                KIPRI
                <span className="text-4xl max-[290px]:leading-none leading-tight"> . dev</span>
            </a>
            <section className="flex flex-wrap justify-center gap-4">
                <Link style={{ color: "white" }} className="button border-white" href={URLS.REPLACE}>
                    replace
                </Link>
                <Link style={{ color: "white" }} className="button border-white" href={URLS.SMOL}>
                    smol
                </Link>
                <Link style={{ color: "white" }} className="button border-white" href={URLS.QR}>
                    qr
                </Link>
                {
                    /* <Link style={{ color: "white" }} className="button border-white" href={URLS.CLOSET}>
                    closet
                    </Link> */
                }
            </section>
        </main>
    );
};

export default IndexPage;
