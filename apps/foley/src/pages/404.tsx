import { Section } from "@components/Section";
import { URLS } from "@utils/enums";
import { fontLondrinaSketch } from "@utils/font";
import { Link } from "ui/components/Link";

export default function FoOFoPage(): JSX.Element {
    return (
        <Section className="grid place-content-center gap-4 py-12 xs:min-h-[70vh] min-h-[40vh] bg-ivory dark:bg-black dark:text-white">
            <h1 className={`text-9xl max-xs:text-7xl font-bold text-center ${fontLondrinaSketch}`}>
                u lost?
            </h1>

            <p className="mb-4 text-lg text-center">aww... naww...</p>

            <Link button href={URLS.HOME} className="button text-center">go home</Link>
        </Section>
    );
}
