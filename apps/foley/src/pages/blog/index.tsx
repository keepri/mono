import { type Post } from "db";
import Bounce from "@components/Animations/Bounce";
import { fontLondrinaSketch } from "@utils/font";
import {
    type GetStaticPropsContext,
    type GetStaticPropsResult,
    type InferGetStaticPropsType,
    type NextPage,
} from "next";
// import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

type Props = InferGetStaticPropsType<typeof getStaticProps>;
type Slug = Props["posts"][number]["slug"];

const BlogPage: NextPage<Props> = (props) => {
    const router = useRouter();
    // const session = useSession();
    // const isAuthenticated = session.status === "authenticated";
    const slugs = memoizePostSlugs(props.posts);

    const [errMessage, setErrMessage] = useState<string>("");
    const [alertSignIn, setAlertSignIn] = useState<boolean>(false);

    const handleNavigate = useCallback((slug: Slug): void => {
        if (!slugs?.has(slug)) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setErrMessage("can't be opened");

            return;
        }

        router.push(`/blog/${slug}`);
    }, [router, slugs]);

    useEffect(() => {
        if (!errMessage.length) {
            return;
        }

        const timeout = setTimeout(() => setErrMessage(""), 7000);

        return () => clearTimeout(timeout);
    }, [errMessage]);

    useEffect(() => {
        if (!alertSignIn) {
            return;
        }

        const timeout = setTimeout(() => setAlertSignIn(false), 7000);

        return () => clearTimeout(timeout);
    }, [alertSignIn]);

    return (
        <section className="flex flex-col items-center gap-4 min-h-screen bg-ivory dark:bg-black">
            <header className="text-center dark:text-white">
                <Bounce enabled={!!errMessage.length || alertSignIn} className={`${errMessage.length || alertSignIn ? "" : "invisible"} mb-2`}>
                    <p className="text-lg">{errMessage.length ? errMessage : "please sign in"}</p>
                </Bounce>

                <h1 className={`max-xs:text-8xl text-[200px] leading-none ${fontLondrinaSketch}`}>
                    blog
                </h1>

                <p className="mt-2 text-lg">:w 👨‍💻</p>
            </header>

            <ul className={`${props.posts.length ? "flex flex-col gap-6 mt-10 text-white" : "hidden"}`}>
                {props.posts.map((post) => (
                    <li
                        key={post.slug}
                        className="group py-2 px-4 cursor-pointer max-w-[60ch]"
                        onClick={handleNavigate.bind(handleNavigate, post.slug)}
                    >
                        <h4 className="text-2xl font-medium group-hover:text-[var(--clr-orange)] group-hover:underline">{post.title}</h4>

                        <p className="leading-snug">{post.description}</p>

                        <small className="text-sm font-light">{post.createdAt}</small>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default BlogPage;

export async function getStaticProps(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _ctx: GetStaticPropsContext,
): Promise<GetStaticPropsResult<{
    posts: Array<Pick<Post, "title" | "description" | "excerpt" | "slug" | "category"> & { createdAt: string }>;
}>> {
    return {
        props: {
            posts: [
                // {
                //     slug: "slug-1",
                //     title: "#title 1",
                //     description: "description 1",
                //     excerpt: "aksjdhf",
                //     category: "aksljdfh",
                //     createdAt: "June 7"
                // },
                // {
                //     slug: "slug-2",
                //     title: "#title 2",
                //     description: "description 2",
                //     excerpt: "aksjdhf",
                //     category: "aksljdfh",
                //     createdAt: "June 7"
                // },
                // {
                //     slug: "slug-3",
                //     title: "#title 3",
                //     description: "description 3 description 3description 3description 3description 3description 3description 3description 3",
                //     excerpt: "aksjdhf",
                //     category: "aksljdfh",
                //     createdAt: "June 7"
                // },
            ],
        },
        revalidate: 60 * 60 * 24, // seconds (1 day)
    } satisfies GetStaticPropsResult<Props>;
}

function memoizePostSlugs(posts: Props["posts"]): Set<Slug> | undefined {
    // eslint-disable-next-line react-hooks/rules-of-hooks, react-hooks/exhaustive-deps
    return useMemo(() => posts.length === 0 ? void 0 : new Set<Slug>(posts.map((post) => post.slug)), []);
}
