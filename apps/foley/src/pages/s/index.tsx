import { Button, Input, Spinner } from "ui";
import Bounce from "@components/Animations/Bounce";
import { fontInconsolata, fontLondrinaSketch } from "@utils/font";
import { fetchCreateSmol } from "@utils/helpers";
import { useSession } from "next-auth/react";
import { type NextPage } from "next/types";
import { useCallback, useState, type FormEvent, useEffect } from "react";
import { generateErrorMessage } from "zod-error";
import { Section } from "@components/Section";
import { SmolSchema } from "db/schemas";

const SmolPage: NextPage = () => {
    const isAuthenticated = useSession().status === "authenticated";

    const [errMessage, setErrMessage] = useState<string>("");
    const [alertSignIn, setAlertSignIn] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [url, setUrl] = useState<string>("");
    const [smol, setSmol] = useState<string>("");

    const handleMakeSmol = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isAuthenticated) {
            setAlertSignIn(true);
            setTimeout(() => setAlertSignIn(false), 2769);

            return;
        }

        setLoading(true);

        const parsed = SmolSchema.shape.url.safeParse(url);

        if (!parsed.success) {
            console.warn("invalid url", generateErrorMessage(parsed.error.issues));
            setErrMessage("please provide a valid url");
            setLoading(false);

            return;
        }

        try {
            setSmol(await fetchCreateSmol(parsed.data));
            setLoading(false);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch ({ stack, message }: any) {
            console.error(stack);
            console.error("create smol", message);
            setErrMessage("nope");
            setLoading(false);
        }
    }, [isAuthenticated, url]);

    useEffect(() => {
        if (!errMessage.length) {
            return;
        }

        const timeout = setTimeout(() => setErrMessage(""), 7419);

        return () => clearTimeout(timeout);
    }, [errMessage]);

    return (
        <div className="grid place-items-center py-12 min-h-[70vh] bg-ivory dark:bg-black leading-tight">
            <Section className="flex flex-col items-center justify-center gap-8">
                <div className="text-center leading-none">
                    <Bounce enabled={alertSignIn} className={alertSignIn ? undefined : "invisible"}>
                        <p className={`text-lg dark:text-white ${fontInconsolata}`}>please sign in</p>
                    </Bounce>

                    <h1 className={`max-xxs:text-7xl max-xs:text-9xl text-[200px] dark:text-white ${fontLondrinaSketch}`}>
                        smol
                    </h1>

                    <p className="max-sm:mt-2 dark:text-white">shorten link</p>
                </div>

                <Spinner variant="puff" className={`stroke-white relative top-[5.5rem] ${!loading ? "hidden" : ""}`} />

                {Boolean(smol.length || errMessage.length) && !loading && (
                    <div className="flex flex-col justify-center gap-4">
                        {Boolean(smol.length) && <span className="text-center text-3xl">🚀</span>}

                        <div className="flex flex-col items-center justify-center">
                            <a
                                style={{ textDecorationColor: "#9d679c" }}
                                className="underline underline-offset-8 text-center dark:text-white text-lg"
                                target={smol.length ? "_blank" : undefined}
                                href={smol.length ? smol : "#"}
                                rel="noreferrer"
                            >
                                {errMessage.length ? errMessage : String(smol?.split("://")[1])}
                                <br />
                            </a>

                            <div className="text-center dark:text-white font-bold">
                                /|\ ^._.^ /|\
                            </div>
                        </div>
                    </div>
                )}

                <form
                    onSubmit={handleMakeSmol}
                    className={`grid auto-rows-auto gap-8 place-items-center dark:text-white w-full ${loading ? "invisible" : ""}`}
                >
                    <Input
                        placeholder="gib text, link or good vibes"
                        className="w-full max-w-[30rem] dark:bg-black border-4 border-gray-300 placeholder-gray-400 focus:outline-[var(--clr-orange)] focus:outline-dotted focus:outline-4"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />

                    <Button type="submit" className={`button border-gray-400 bg-white dark:bg-black ${fontInconsolata}`} disabled={loading}>
                        boop
                    </Button>
                </form>
            </Section>
        </div>
    );
};

export default SmolPage;
