import { type JSXElement, type VoidComponent } from "solid-js";
import Hero from "~/components/Hero";
import { trpc } from "~/utils/trpc";

const Home: VoidComponent = (): JSXElement => {
    const { data } = trpc.example.hello.useQuery(() => ({ name: "nika" }));

    return (
        <>
            <Hero class="flex items-center justify-center">
                <section class="container flex flex-col items-center justify-center">
                    <h1 class="font-hatton-semibold text-9xl font-extrabold tracking-wide text-center">{data}.</h1>
                </section>
            </Hero>
        </>
    );
};

export default Home;
