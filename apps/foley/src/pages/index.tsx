import { londrinaSketch } from "@utils/misc";
import { type NextPage } from "next/types";

const IndexPage: NextPage = () => {
    return (
        <>
            <section className="grid place-content-center place-items-center gap-12 min-h-screen bg-gradient-to-b from-[var(--clr-bg-500)] to-[var(--clr-bg-300)]">
                <a
                    href="mailto:hi@kipri.dev"
                    style={{ fontSize: "clamp(4rem, 15vw, 18rem)" }}
                    className={`relative text-[var(--clr-white)] text-center px-4 ${londrinaSketch.variable} font-londrina-sketch leading-none sm:whitespace-nowrap hover:text-[var(--clr-orange)] transition-colors duration-100 max-[365px]:max-w-[11rem]`}
                >
                    <span className="text-5xl leading-none">hi @ </span>
                    KIPRI
                    <span className="text-5xl leading-none"> . dev</span>
                </a>
            </section>
        </>
    );
};

export default IndexPage;
