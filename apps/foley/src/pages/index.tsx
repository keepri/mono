import { Link } from "@clfxc/ui/components/Link";
import { URLS } from "@declarations/enums";
import { londrinaSketch } from "@utils/misc";
import { type NextPage } from "next/types";

const IndexPage: NextPage = () => {
    return (
        <>
            <section className="grid place-content-center place-items-center gap-12 min-h-screen bg-gradient-to-t from-[var(--clr-bg-500)] to-[var(--clr-bg-300)]">
                <a
                    href="mailto:hi@kipri.dev"
                    style={{ fontSize: "clamp(4rem, 15vw, 18rem)" }}
                    className={`relative text-[var(--clr-white)] text-center px-4 ${londrinaSketch.variable} font-londrina-sketch leading-none sm:whitespace-nowrap hover:text-[var(--clr-bg-500)] transition-colors max-[365px]:max-w-[11rem]`}
                >
                    <span className="text-5xl leading-none">hi @ </span>
                    KIPRI
                    <span className="text-5xl leading-none"> . dev</span>
                </a>
                <section className={`flex flex-wrap justify-center gap-4`}>
                    <Link style={{ color: "white" }} className={`button border-white`} href={URLS.REPLACE}>
                        replace
                    </Link>
                    <Link style={{ color: "white" }} className={`button border-white`} href={URLS.SMOL}>
                        smol
                    </Link>
                    <Link style={{ color: "white" }} className={`button border-white`} href={URLS.QR}>
                        qr
                    </Link>
                </section>
            </section>
        </>
    );
};

export default IndexPage;
