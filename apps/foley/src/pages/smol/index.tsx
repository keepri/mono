import { Button, Input, Spinner } from "@clfxc/ui";
import LoadingBounce from "@components/Loading/LoadingBounce";
import { createSmol } from "@utils/helpers";
import { underdog } from "@utils/misc";
import { useSession } from "next-auth/react";
import { type NextPage } from "next/types";
import { type ChangeEvent, type FormEvent, useCallback, useState, startTransition } from "react";
import { generateErrorMessage } from "zod-error";

const SmolPage: NextPage = () => {
    const session = useSession();
    const isAuthenticated = session.status === "authenticated";

    const [alertSignIn, setAlertSignIn] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [url, setUrl] = useState<string>("");
    const [smol, setSmol] = useState<string>("");
    const [chill, setChill] = useState<string>("");

    const handleChangeUrl = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
    }, []);

    const handleMakeSmol = useCallback(
        async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            if (!isAuthenticated) {
                setAlertSignIn(true);
                startTransition(() => {
                    setTimeout(() => {
                        setAlertSignIn(false);
                    }, 2769);
                });
                return;
            }

            setLoading(true);
            const urlSchema = (await import("@declarations/schemas")).UrlSchema;
            const parsed = urlSchema.safeParse(url);


            if (!parsed.success) {
                const message = generateErrorMessage(parsed.error.issues);
                console.warn("invalid url", message);
                setLoading(false);
                return;
            }

            try {
                const data = await createSmol(url);

                if ("message" in data) {
                    setChill("take a chill pill");
                    setLoading(false);
                    return;
                }

                setSmol(data?.smol ?? "#");
                setLoading(false);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch ({ message }: any) {
                setLoading(false);
                console.log("something went wrong", message);
            }
        },
        [isAuthenticated, url]
    );

    return (
        <section className="grid place-items-center place-content-center leading-tight min-h-screen p-4 bg-gradient-to-b from-[var(--clr-bg-500)] to-[var(--clr-bg-300)]">
            <h1
                style={{ fontSize: "clamp(4rem, 14vw, 12rem)" }}
                className={`${underdog.variable} font-underdog text-center text-white leading-none`}
            >
                make smol
            </h1>

            <Spinner variant="puff" className={`stroke-white relative top-[5.5rem] ${!loading ? "invisible" : ""}`} />

            <LoadingBounce enabled={alertSignIn} className={alertSignIn ? undefined : "invisible"}>
                <p className="mb-4 text-lg text-yellow-300 animate-bounce">
                    please sign in
                </p>
            </LoadingBounce>

            {Boolean(smol.length) && !loading && (
                <>
                    <span className="text-center text-3xl">🚀</span>
                    <a
                        style={{ textDecorationColor: "#9d679c", color: "white" }}
                        className="underline underline-offset-4 text-center font-light text-lg"
                        target="_blank"
                        href={smol}
                        rel="noreferrer"
                    >
                        {chill.length ? chill : String(smol?.split("://")[1])}
                        <br />
                    </a>
                    <span className="text-[var(--clr-bg-500)] text-center font-bold mb-3">/|\ ^._.^ /|\</span>
                </>
            )}

            <form
                onSubmit={handleMakeSmol}
                className={`grid auto-rows-auto gap-8 place-items-center w-full ${loading ? "invisible" : ""}`}
            >
                <Input
                    placeholder="gib text, link or good vibes"
                    className={`w-full max-w-[30rem] bg-[var(--clr-bg-500)] text-white border-4 focus:outline-[var(--clr-orange)] focus:outline-dotted focus:outline-4`}
                    value={url}
                    onChange={handleChangeUrl}
                />
                <Button
                    type="submit"
                    className={`button border-white text-white`}
                    disabled={loading}
                >
                    boop
                </Button>
            </form>
        </section>
    );
};

export default SmolPage;
