import { Suspense, type JSXElement, type VoidComponent } from "solid-js";
import { trpc } from "~/utils/trpc";
import { useSession } from "~/utils/auth";

const AuthShowcase: VoidComponent = (): JSXElement => {
    const session = useSession();

    return (
        <Suspense fallback={<p>Loading...</p>}>
            <div class="flex flex-col items-center justify-center gap-4">
                <p class="text-center text-2xl text-white">
                    {session() && <span>Logged in as {session()?.user?.name}</span>}
                </p>
                <button class="flex group rounded-full bg-white/10 px-8 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
                    {session() ? "noboop" : "boop"}
                </button>
            </div>
        </Suspense>
    );
};

const Home: VoidComponent = (): JSXElement => {
    const { data } = trpc.example.hello.useQuery(() => ({ name: "nika" }));

    return (
        <main class="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#222] to-[#000]">
            <div class="container flex flex-col items-center justify-center gap-4 p-2 max-w-[45ch]">
                <h1 class="font-hatton-semibold text-9xl font-extrabold tracking-wide text-center text-white">
                    {data}.
                </h1>
                <div class="flex flex-col items-center gap-2">
                    <AuthShowcase />
                </div>
            </div>
        </main>
    );
};

export default Home;
