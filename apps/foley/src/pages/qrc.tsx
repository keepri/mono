import { QRCodeToDataURLOptions, toDataURL } from "@clfxc/services/qr";
import { Button, Input, InputOnChange } from "@clfxc/ui";
import { Storage } from "@declarations/enums";
import { getTextBytes, makeCode } from "@utils/helpers";
import { origin, underdog } from "@utils/misc";
import { useSession } from "next-auth/react";
import { type NextPage } from "next/types";
import { createRef, type FormEvent, useCallback, useEffect, useState, startTransition } from "react";

const FILE_NAME = "gib_qr";

const QRCodePage: NextPage = () => {
    const inputCache = typeof window !== "undefined" ? localStorage.getItem(Storage.qrInput) : undefined;
    const defaultInputText: string = inputCache ? JSON.parse(inputCache) : "";
    const defaultMargin: number = 2;
    const maxMargin: number = 7;
    const defaultQrOptions = {
        margin: typeof window !== "undefined" ? +(localStorage.getItem(Storage.qrMargin) || defaultMargin) : defaultMargin,
        width: 200,
        color: {
            light: typeof window !== "undefined" ? localStorage.getItem(Storage.qrBackgroundColor) || "#ffffff" : "#ffffff",
            dark: typeof window !== "undefined" ? localStorage.getItem(Storage.qrPatternColor) || "#000000" : "#000000",
        },
        rendererOpts: {
            quality: 1,
        },
    } satisfies QRCodeToDataURLOptions;

    const session = useSession();
    const isAuthenticated = session.status === "authenticated";

    const canvasRef = createRef<HTMLCanvasElement>();
    const signInAlertRef = createRef<HTMLParagraphElement>();

    const [text, setText] = useState<string>(defaultInputText);
    // const [selectedFile, setSelectedFile] = useState<File | null>(null); TODO
    const [svgUriCache, setSvgUriCache] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [pngUrl, setPngUrl] = useState<string | null>(null);
    const [qrOpts, setQrOpts] = useState<QRCodeToDataURLOptions>(defaultQrOptions);

    // const fileSize = useMemo(() => toKB(selectedFile?.size ?? -1), [selectedFile]);

    const handleChangeInput: InputOnChange = useCallback((e) => {
        const name = e.target.name;
        const value = e.target.value.trim();

        // we clear the cache anytime the user tries to generate a new qr code
        setSvgUriCache(null);

        if (name === "qr-input") {
            const text = e.target.value;
            localStorage.setItem(Storage.qrInput, JSON.stringify(text));
            setText(text);
        }

        if (name === "qr-margin") {
            const parsed = value.at(0) === "-" ? 0 : Number(value.charAt(value.length - 1));
            const isValid = isNaN(parsed) === false && parsed <= maxMargin && parsed >= 0;
            setQrOpts((opts) => {
                const margin: number = isValid ? parsed : opts.margin!;
                localStorage.setItem(Storage.qrMargin, JSON.stringify(margin));
                return { ...opts, margin };
            });
        }

        // colors block ---
        if ((!value.startsWith("#") && value !== "") || value.length > 9) {
            return;
        }
        if (name === "qr-color-bg") {
            localStorage.setItem(Storage.qrBackgroundColor, value);
            setQrOpts((opts) => ({ ...opts, color: { ...opts.color, light: value } }));
        }
        if (name === "qr-color") {
            localStorage.setItem(Storage.qrPatternColor, value);
            setQrOpts((opts) => ({ ...opts, color: { ...opts.color, dark: value } }));
        }
        // colors block ---
    }, []);

    // const handleChangeFile: InputOnChange = useCallback((e) => {
    //     const maxFileSize = 3;
    //     const { ok, file, error } = validateFile(e.target.files?.[0], maxFileSize);
    //
    //     if (!ok) {
    //         console.error("invalid file", error);
    //
    //         if (error === "file too big") {
    //             // TODO: handle file too big error
    //             return;
    //         }
    //         // TODO: add error here
    //         return;
    //     }
    //
    //     setSelectedFile(file);
    // }, []);

    const handleSvgDownload = useCallback(async () => {
        try {
            if (!isAuthenticated) {
                signInAlertRef.current?.classList.toggle("invisible");
                setTimeout(() => {
                    signInAlertRef.current?.classList.toggle("invisible");
                }, 2000);
                return;
            }

            setLoading(true);

            startTransition(() => {
                const linkTag = document.createElement("a");

                if (svgUriCache) {
                    linkTag.href = svgUriCache;
                    linkTag.download = FILE_NAME;
                    linkTag.click();
                    setLoading(false);

                    return;
                }

                const headers = new Headers();
                headers.set("Content-Type", "application/json");
                fetch(origin + "/api/qr/create", {
                    headers,
                    method: "POST",
                    body: JSON.stringify({ data: text, options: qrOpts }),
                }).then(async (res) => {
                    const qrCode = await res.json();
                    linkTag.href = qrCode.uri;
                    linkTag.download = FILE_NAME;
                    linkTag.click();

                    setSvgUriCache(qrCode.uri);
                    setLoading(false);
                }).catch(({ message, stack }) => {
                    setLoading(false);
                    console.warn(stack);
                    console.error(message);
                });
            });
        } catch ({ message, stack }) {
            setLoading(false);
            console.warn(stack);
            console.error("could not download svg", message);
        }
    }, [isAuthenticated, qrOpts, signInAlertRef, svgUriCache, text]);

    const handleSubmit = useCallback(
        async (e?: FormEvent<HTMLFormElement>) => {
            try {
                e && e.preventDefault();
                if (!canvasRef.current) return;

                // if (selectedFile) {
                // handle file uploaded creation
                // readFileAsDataUrl(selectedFile, async (e) => {
                //     const data = e.target?.result as string;
                //     if (!data) return;
                //     makeCode(data);
                // });

                // return;
                // }

                if (!Boolean(text.length)) return;

                const bytes = getTextBytes(text);
                if (bytes > 2953) return;

                const code = await makeCode(text);

                toDataURL(
                    canvasRef.current!,
                    code.segments.map((segment) => ({ ...segment, mode: segment.mode.id })),
                    qrOpts,
                    (err, url) => {
                        if (err) {
                            const { message, stack } = err;
                            console.error("could not create code image", { message, stack });
                            return;
                        }

                        setPngUrl(url);
                    }
                );
            } catch (error) {
                console.error("submit failed", error);
            }
        },
        [canvasRef, qrOpts, text]
    );

    useEffect(() => {
        const backgroudColorLen = qrOpts.color?.light?.length;
        const isBackgroundLen = backgroudColorLen === 4 || backgroudColorLen === 7 || backgroudColorLen === 9;

        const patternColorLen = qrOpts.color?.dark?.length;
        const isPatternLen = patternColorLen === 4 || patternColorLen === 7 || patternColorLen === 9;

        if (!text.length || !isBackgroundLen || !isPatternLen) return;

        handleSubmit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text, qrOpts.color?.dark, qrOpts.color?.light, qrOpts.margin]);

    return (
        <>
            <main className="flex flex-wrap sm:gap-0 gap-8 p-4 min-h-screen bg-[var(--clr-bg-300)]">
                <section className="flex flex-col flex-[2.5] items-center sm:justify-center xl:gap-24 gap-8">
                    <form className="flex flex-col items-center justify-center gap-8 px-2 w-full">
                        <h1
                            style={{ fontSize: "clamp(7rem, 14vw, 12rem)" }}
                            className={`${underdog.variable} font-underdog text-center text-white sm:leading-none md:mb-10`}
                        >
                            qr
                        </h1>
                        <Input
                            name="qr-input"
                            placeholder="gib text, link or good vibes"
                            value={text}
                            className={`max-w-[25rem] w-full bg-[var(--clr-bg-500)] text-white border-4 outline-[var(--clr-orange)] focus:outline-offset-8 focus:outline-dashed`}
                            onChange={handleChangeInput}
                        />
                        <div aria-label="buttons" className="flex flex-wrap items-center justify-center gap-4">
                            {
                                //     <Input
                                //     type="file"
                                //     // TODO: TEMP: not done
                                //     labelclass="hidden text-white font-nixie-one hover:bg-[var(--clr-bg-500)] hover:border-[var(--clr-orange)] active:bg-[var(--clr-orange)] active:border-[var(--clr-bg-500)] active:text-white active:scale-110"
                                //     onChange={handleChangeFile}
                                // />
                            }
                            {
                                // <Button type="submit" className={`button border-white text-white`}>
                                //     boop
                                // </Button>
                            }
                        </div>
                    </form>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Input
                            label="pattern color"
                            labelclass={`w-full max-w-[10rem] text-white font-light whitespace-nowrap`}
                            className={`w-full max-w-[10rem] text-[var(--clr-bg-500)] block`}
                            value={qrOpts.color!.dark?.toUpperCase()}
                            placeholder="hex code"
                            name="qr-color"
                            onChange={handleChangeInput}
                        />
                        <Input
                            label="background color"
                            labelclass={`w-full max-w-[10rem] text-white font-light whitespace-nowrap`}
                            className={`w-full max-w-[10rem] text-[var(--clr-bg-500)] block`}
                            value={qrOpts.color!.light?.toUpperCase()}
                            placeholder="hex code"
                            name="qr-color-bg"
                            onChange={handleChangeInput}
                        />
                        <Input
                            type="number"
                            label="margin"
                            labelclass={`w-full max-w-[10rem] text-white font-light whitespace-nowrap`}
                            className={`w-full max-w-[10rem] text-[var(--clr-bg-500)] block`}
                            value={qrOpts.margin}
                            placeholder="background color"
                            name="qr-margin"
                            onChange={handleChangeInput}
                        />
                    </div>

                    {/* <p
					className={`flex flex-wrap items-center justify-center gap-4 text-white text-center max-w-[40ch] text-xs sm:max-w-[unset] ${
						!selectedFile ? 'invisible' : ''
					}`}
				>
					{selectedFile?.name}{' '}
					<span className="px-2 py-2 ml-4 rounded bg-[var(--clr-orange)]">{selectedFile?.type.split('/')[1]}</span>
					<span className="px-2 py-2 rounded bg-[var(--clr-orange)]">
						{fileSize.toFixed(2)}kB {fileSize > 1000 ? '🚀' : ''}
					</span>
				</p> */}
                </section>
                <section className="flex flex-col flex-[1] justify-center gap-8">
                    <div className="flex flex-col items-center justify-center sm:gap-8 gap-4 flex-[1]">
                        <p ref={signInAlertRef} className="invisible text-lg text-yellow-300 animate-bounce">please sign in</p>
                        <canvas ref={canvasRef} width={200} height={200} className="rounded max-w-[250px] max-h-[250px] bg-[var(--clr-bg-500)]" />
                        <div className="flex justify-around items-center gap-4">
                            <a
                                href={pngUrl ?? "#"}
                                download={FILE_NAME}
                                className={`button border-white text-white visited:text-white ${!pngUrl ? "invisible" : ""}`}
                            >
                                png
                            </a>
                            <Button
                                disabled={loading}
                                className={`button border-white text-white ${!pngUrl ? "invisible" : ""}`}
                                onClick={handleSvgDownload}
                            >
                                {loading ? "on it..." : "svg"}
                            </Button>
                        </div>
                        <p className={`text-3xl ${!pngUrl ? "invisible" : ""}`}>
                            🚀
                        </p>
                    </div>
                </section>
            </main>
        </>
    );
};

export default QRCodePage;
