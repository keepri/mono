import {
    type InferGetStaticPropsType,
    type GetStaticPathsContext,
    type GetStaticPathsResult,
    type GetStaticPropsContext,
    type GetStaticPropsResult,
    type NextPage,
} from "next";
import { useRouter } from "next/router";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const BlogEntry: NextPage<Props> = (props) => {
    const router = useRouter();

    if (router.isFallback === true) {
        return (
            <section className="min-h-[85vh] p-4 bg-gradient-to-b from-[var(--clr-bg-500)] to-[var(--clr-bg-300)]">
                <p className="text-white text-4xl">loading...</p>
            </section>
        );
    }

    return (
        <ReactMarkdown className="min-h-[85vh] bg-gradient-to-b from-[var(--clr-bg-500)] to-[var(--clr-bg-300)]">
            {props.markdown}
        </ReactMarkdown>
    );
};

export default BlogEntry;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getStaticPaths(_ctx: GetStaticPathsContext): Promise<GetStaticPathsResult> {
    const paths: GetStaticPathsResult["paths"] = [];

    return {
        paths,
        fallback: true,
    };
}

export async function getStaticProps(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _ctx: GetStaticPropsContext,
): Promise<GetStaticPropsResult<{ markdown: string }>> {
    return {
        props: {
            markdown: "",
        },
        revalidate: 60 * 60 * 24, // seconds (1 day)
    } satisfies GetStaticPropsResult<Props>;
}
