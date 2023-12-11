import Section from "@components/Section";
import { URLS } from "@utils/enums";
import { fontLondrinaSketch } from "@utils/font";
import { GetServerSidePropsContext, GetServerSidePropsResult, InferGetServerSidePropsType } from "next";
import { Balancer } from "react-wrap-balancer";
import { Link } from "ui/components/Link";

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function ErrorPage({ statusCode }: Props): JSX.Element {
    if (statusCode === 404) {
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

    return (
        <Section className="grid place-content-center gap-8 py-12 xs:min-h-[70vh] min-h-[40vh] bg-ivory dark:bg-black dark:text-white">
            <h1 className={`text-9xl max-xs:text-7xl font-bold text-center ${fontLondrinaSketch}`}>
                oops
            </h1>

            <span>
                <p className="text-lg text-center">
                    <Balancer>
                        encountered an error, sorry about that!
                    </Balancer>
                </p>

                <p className="text-sm text-center font-light">
                    code: {statusCode}
                </p>
            </span>

            <Link button href={URLS.HOME} className="button text-center">go home</Link>
        </Section>
    );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<{
    statusCode: number;
}>> {
    return {
        props: {
            statusCode: ctx.res.statusCode ?? 404
        }
    };
}
