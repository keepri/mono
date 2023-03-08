import { Suspense, type JSXElement, type VoidComponent } from "solid-js";
import { useSession } from "~/utils/auth";
import { trpc } from "~/utils/trpc";

const AuthShowcase: VoidComponent = (): JSXElement => {
    const session = useSession();

    return (
        <div class="flex flex-col items-center justify-center gap-4">
            <p class="text-center text-2xl text-white">
                {session() && <span>Logged in as {session()?.user?.name} </span>}
            </p>
            <p class="cursor-pointer rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
                {session() ? "boop" : "boop"}
            </p>
        </div>
    );
};

const Home: VoidComponent = (): JSXElement => {
    const { data } = trpc.example.hello.useQuery(() => ({ name: "NIKA" }));

    return (
        <main class="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#222] to-[#000]">
            <div class="container flex flex-col items-center justify-center gap-12 px-4 py-16 max-w-[45ch]">
                <h1 class="text-5xl font-extrabold tracking-tight text-center text-white sm:text-[5rem]">
                    {data} marketing agency
                </h1>
                <div class="flex flex-col items-center gap-2">
                    <Suspense fallback={<p>Loading...</p>}>
                        <AuthShowcase />
                    </Suspense>
                </div>
            </div>
        </main>
    );
};

export default Home;
