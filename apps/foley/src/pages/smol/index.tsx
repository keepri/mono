import { Button, Input, Spinner } from "@clfxc/ui";
import LoadingBounce from "@components/Loading/LoadingBounce";
import { fetchCreateSmol } from "@utils/helpers";
import { underdog } from "@utils/misc";
import { useSession } from "next-auth/react";
import { type NextPage } from "next/types";
import { startTransition, useCallback, useState, type ChangeEvent, type FormEvent, useEffect } from "react";
import { generateErrorMessage } from "zod-error";

const SmolPage: NextPage = () => {
    const isAuthenticated = useSession().status === "authenticated";

    const [errMessage, setErrMessage] = useState<string>("");
    const [alertSignIn, setAlertSignIn] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [url, setUrl] = useState<string>("");
    const [smol, setSmol] = useState<string>("");

    const handleChangeUrl = (e: ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
    };

    const handleMakeSmol = useCallback(
        async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            if (!isAuthenticated) {
                setAlertSignIn(true);
                return startTransition(() => {
                    setTimeout(() => setAlertSignIn(false), 2769);
                });
            }

            setLoading(true);

            const urlSchema = (await import("@utils/schemas")).UrlSchema;
            const parsed = urlSchema.safeParse(url);

            if (!parsed.success) {
                const message = generateErrorMessage(parsed.error.issues);
                console.warn("invalid url", message);
                setLoading(false);
                return;
            }

            try {
                const data = await fetchCreateSmol(parsed.data);

                setSmol(data);
                setLoading(false);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch ({ stack, message }: any) {
                setErrMessage("nope");
                setLoading(false);
                console.error(stack);
                console.error("create smol", message);
            }
        },
        [isAuthenticated, url]
    );

    useEffect(() => {
        if (!errMessage.length) return;
        setTimeout(() => setErrMessage(""), 7419);
    }, [errMessage]);

    return (
        <section className="flex flex-col items-center justify-center gap-8 leading-tight min-h-[85vh] p-4 bg-gradient-to-b from-[var(--clr-bg-500)] to-[var(--clr-bg-300)]">

            <div className="text-center text-white leading-none max-sm:mt-20 mt-[-10%]">
                <LoadingBounce enabled={alertSignIn} className={alertSignIn ? undefined : "invisible"}>
                    <p className="text-lg text-yellow-300">please sign in</p>
                </LoadingBounce>
                <h1 style={{ fontSize: "clamp(6rem, 22vw, 15rem)" }} className={`${underdog.variable} font-underdog leading-none`}>
                    smol
                </h1>
                <p className="max-sm:mt-2">shorten link</p>
            </div>

            <Spinner variant="puff" className={`stroke-white relative top-[5.5rem] ${!loading ? "hidden" : ""}`} />

            {Boolean(smol.length || errMessage.length) && !loading && (
                <div className="flex flex-col justify-center">
                    <span className="text-center text-3xl">🚀</span>
                    <div className="flex flex-col items-center justify-center">
                        <a
                            style={{ textDecorationColor: "#9d679c", color: "white" }}
                            className="underline underline-offset-4 text-center font-light text-lg"
                            target="_blank"
                            href={smol.length ? smol : "#"}
                            rel="noreferrer"
                        >
                            {errMessage.length ? errMessage : String(smol?.split("://")[1])}
                            <br />
                        </a>
                        <div className="text-[var(--clr-bg-500)] text-center font-bold mb-3">
                            /|\ ^._.^ /|\
                        </div>
                    </div>
                </div>
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
                <Button type="submit" className="button border-white text-white" disabled={loading}>
                    boop
                </Button>
            </form>
        </section>
    );
};

export default SmolPage;
