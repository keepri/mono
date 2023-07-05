import { type Post } from "@clfxc/db";
import Bounce from "@components/Animations/Bounce";
import { underdog } from "@utils/misc";
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

    const handleNavigate = useCallback((slug: Slug) => {
        if (!slugs?.has(slug)) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setErrMessage("can't be opened");
            return;
        }

        router.push(`/blog/${slug}`);
    }, [router, slugs]);

    useEffect(() => {
        if (!errMessage.length) return;
        const timeout = setTimeout(() => setErrMessage(""), 7000);
        return () => clearTimeout(timeout);
    }, [errMessage]);

    useEffect(() => {
        if (!alertSignIn) return;
        const timeout = setTimeout(() => setAlertSignIn(false), 7000);
        return () => clearTimeout(timeout);
    }, [alertSignIn]);

    return (
        <section className="flex flex-col items-center gap-4 min-h-[85vh] p-4 bg-gradient-to-b from-[var(--clr-bg-500)] to-[var(--clr-bg-300)]">
            <header className="text-center text-white">
                <Bounce enabled={!!errMessage.length || alertSignIn} className={`${errMessage.length || alertSignIn ? "" : "invisible"} mb-2`}>
                    <p className="text-lg text-yellow-300">{errMessage.length ? errMessage : "please sign in"}</p>
                </Bounce>
                <h1 style={{ fontSize: "clamp(4rem, 15vw, 10rem)" }} className={`${underdog.variable} font-underdog leading-none`}>
                    blog
                </h1>
                <p className="max-sm:mt-2">:w 👨‍💻</p>
            </header>

            <ul className={`${props.posts.length ? "flex flex-col gap-10 mt-10 text-white" : "hidden"}`}>
                {props.posts.map((post) => (
                    <li
                        key={post.slug}
                        className="group p-2 cursor-pointer max-w-[60ch]"
                        onClick={handleNavigate.bind(handleNavigate, post.slug)}
                    >
                        <h4 className="mb-2 text-2xl font-medium group-hover:text-[var(--clr-orange)] group-hover:underline">{post.title}</h4>
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
        props: { posts: [], },
        revalidate: 60 * 60 * 24, // seconds (1 day)
    } satisfies GetStaticPropsResult<Props>;
}

function memoizePostSlugs(posts: Props["posts"]): Set<Slug> | undefined {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useMemo(() => {
        if (posts.length === 0) return;
        const slugs = Array(posts.length);
        for (const post of posts) (slugs.push(post.slug));
        return new Set<Slug>(slugs);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}
