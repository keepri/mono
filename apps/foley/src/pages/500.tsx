import { Section } from "@components/Section";
import { URLS } from "@utils/enums";
import { fontLondrinaSketch } from "@utils/font";
import { Balancer } from "react-wrap-balancer";
import { Link } from "ui/components/Link";

export default function ErrorPage(): JSX.Element {
    return (
        <Section className="grid place-content-center gap-8 py-12 xs:min-h-[70vh] min-h-[40vh] bg-ivory dark:bg-black dark:text-white">
            <h1 className={`text-9xl max-xs:text-7xl font-bold text-center ${fontLondrinaSketch}`}>
                oops
            </h1>

            <p className="text-lg text-center">
                <Balancer>
                    i&apos;ve encountered an error, sorry about that!
                </Balancer>
            </p>

            <Link button href={URLS.HOME} className="button text-center">go home</Link>
        </Section>
    );
}
