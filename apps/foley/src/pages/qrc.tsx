import { type QRCodeToDataURLOptions, toDataURL } from "@clfxc/services/qr";
import { Button, Input, type InputOnChange } from "@clfxc/ui";
import LoadingBounce from "@components/Loading/LoadingBounce";
import { Storage } from "@declarations/enums";
import { getTextBytes, isHexCode, makeCode } from "@utils/helpers";
import { origin, underdog } from "@utils/misc";
import { useSession } from "next-auth/react";
import { type NextPage } from "next/types";
import {
    createRef,
    useCallback,
    useEffect,
    useState,
    startTransition,
    useMemo,
    type FormEvent,
    type ChangeEventHandler,
} from "react";

const FILE_NAME = "gib_qr";

const QRCodePage: NextPage = () => {
    const inputCache = typeof window !== "undefined" ? localStorage.getItem(Storage.qrInput) : undefined;
    const defaultInputText: string = inputCache ? JSON.parse(inputCache) : "";
    const MAX_MARGIN: number = 7;
    const DEFAULT_MARGIN: number = 2;
    const DEFAULT_PATTERN_COLOR = "#000000";
    const DEFAULT_BACKGROUND_COLOR = "#ffffff";

    const session = useSession();
    const isAuthenticated = session.status === "authenticated";

    const canvasRef = createRef<HTMLCanvasElement>();

    const [chill, setChill] = useState<string>("");
    const [alertSignIn, setAlertSignIn] = useState<boolean>(false);
    const [text, setText] = useState<string>(defaultInputText);
    const [svgUriCache, setSvgUriCache] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [pngUrl, setPngUrl] = useState<string | null>(null);
    const [qrPatternColor, setQrPatternColor] = useState<string>(
        typeof window !== "undefined" ?
            localStorage.getItem(Storage.qrPatternColor) || DEFAULT_PATTERN_COLOR :
            DEFAULT_PATTERN_COLOR
    );
    const [qrBackgroundColor, setQrBackgroundColor] = useState<string>(
        typeof window !== "undefined" ?
            localStorage.getItem(Storage.qrBackgroundColor) || DEFAULT_BACKGROUND_COLOR :
            DEFAULT_BACKGROUND_COLOR
    );
    const [qrMargin, setQrMargin] = useState<number>(
        typeof window !== "undefined" ?
            +(localStorage.getItem(Storage.qrMargin) || DEFAULT_MARGIN) :
            DEFAULT_MARGIN
    );

    const qrOpts: QRCodeToDataURLOptions = useMemo(() => {
        return {
            margin: qrMargin,
            width: 270,
            color: {
                dark: qrPatternColor,
                light: qrBackgroundColor,
            },
            rendererOpts: {
                quality: 1,
            },
        };
    }, [qrMargin, qrPatternColor, qrBackgroundColor]);

    const handleToggleTransparent: ChangeEventHandler<HTMLInputElement> = (e) => {
        const name = e.target.name;
        const isPattern = name === "pattern";
        const color = isPattern ? qrPatternColor : qrBackgroundColor;
        const updateFunc = isPattern ? setQrPatternColor : setQrBackgroundColor;
        const checked = e.target.checked;

        if (!isHexCode(color)) return;

        if (color.length === 4) {
            if (!checked) return;
            updateFunc(`#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}00`);
            return;
        }

        if (color.length === 7) {
            if (!checked) return;
            updateFunc(color + "00");
            return;
        }

        if (color.length === 9) {
            if (checked) return;
            updateFunc(color.slice(0, 7));
            return;
        }
    };

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
            const margin = value.at(0) === "-" ? 0 : Number(value.charAt(value.length - 1));
            const isValid = isNaN(margin) === false && margin <= MAX_MARGIN && margin >= 0;

            if (!isValid) return;

            localStorage.setItem(Storage.qrMargin, JSON.stringify(margin));
            setQrMargin(margin);
        }

        // colors block ---
        if ((!value.startsWith("#") && value !== "") || value.length > 9) {
            return;
        }
        if (name === "qr-color-bg") {
            localStorage.setItem(Storage.qrBackgroundColor, value);
            setQrBackgroundColor(value);
        }
        if (name === "qr-color") {
            localStorage.setItem(Storage.qrPatternColor, value);
            setQrPatternColor(value);
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
                setAlertSignIn(true);
                setTimeout(() => {
                    setAlertSignIn(false);
                }, 2769);
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
                    credentials: "same-origin",
                }).then(async (res) => {
                    const qrCode = await res.json();

                    if ("message" in qrCode) {
                        setChill("take a chill pill");
                        setLoading(false);
                        return;
                    }

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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch ({ message, stack }: any) {
            setLoading(false);
            console.warn(stack);
            console.error("could not download svg", message);
        }
    }, [isAuthenticated, qrOpts, svgUriCache, text]);

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
        const backgroudColorLen = qrBackgroundColor.length;
        const isBackgroundLen = backgroudColorLen === 4 || backgroudColorLen === 7 || backgroudColorLen === 9;

        const patternColorLen = qrPatternColor.length;
        const isPatternLen = patternColorLen === 4 || patternColorLen === 7 || patternColorLen === 9;

        if (!text.length || !isBackgroundLen || !isPatternLen) return;

        handleSubmit();
    }, [handleSubmit, qrBackgroundColor, qrPatternColor, text]);

    useEffect(() => {
        if (!chill.length) return;
        setTimeout(() => setChill(""), 7419);
    }, [chill.length]);

    return (
        <>
            <main className="flex flex-wrap sm:gap-4 gap-8 p-4 min-h-screen bg-gradient-to-b from-[var(--clr-bg-500)] to-[var(--clr-bg-300)]">
                <section className="flex flex-col flex-[2.5] items-center sm:justify-center xl:gap-24 gap-8">
                    <form className="flex flex-col items-center justify-center gap-8 px-2 w-full">
                        <div className="flex max-sm:flex-wrap items-end justify-center mb-4 max-sm:gap-2 text-center text-white leading-none">
                            <h1
                                style={{ fontSize: "clamp(6rem, 19vw, 14rem)" }}
                                className={`${underdog.variable} font-underdog`}
                            >
                                qr
                            </h1>
                            <p className="max-sm:mt-4">code generator</p>
                        </div>

                        <Input
                            name="qr-input"
                            placeholder="gib text, link or good vibes"
                            value={text}
                            className={`max-w-[25rem] w-full bg-[var(--clr-bg-500)] text-white border-4 outline-[var(--clr-orange)] focus:outline-[var(--clr-orange)] focus:outline-dotted focus:outline-4`}
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
                        </div>
                    </form>

                    <div className="flex flex-wrap justify-center gap-4">
                        <span>
                            <Input
                                label="pattern color"
                                labelclass={`w-full max-w-[10rem] text-white font-light whitespace-nowrap`}
                                className={`w-full max-w-[10rem] text-[var(--clr-bg-500)] block`}
                                value={qrPatternColor}
                                placeholder="hex code"
                                name="qr-color"
                                onChange={handleChangeInput}
                            />
                            <Input
                                type='checkbox'
                                label="transparent"
                                labelclass="mt-2 text-white font-light select-none cursor-pointer"
                                className="cursor-pointer"
                                name="pattern"
                                onChange={handleToggleTransparent}
                            />
                        </span>

                        <span>
                            <Input
                                label="background color"
                                labelclass={`w-full max-w-[10rem] text-white font-light whitespace-nowrap`}
                                className={`w-full max-w-[10rem] text-[var(--clr-bg-500)] block`}
                                value={qrBackgroundColor}
                                placeholder="hex code"
                                name="qr-color-bg"
                                onChange={handleChangeInput}
                            />
                            <Input
                                type='checkbox'
                                label="transparent"
                                labelclass="mt-2 text-white font-light select-none cursor-pointer"
                                className="cursor-pointer"
                                name="background"
                                onChange={handleToggleTransparent}
                            />
                        </span>

                        <Input
                            type="number"
                            label="margin"
                            labelclass={`w-full max-w-[10rem] text-white font-light whitespace-nowrap`}
                            className={`w-full max-w-[10rem] text-[var(--clr-bg-500)] block`}
                            value={qrMargin}
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
                        <LoadingBounce
                            enabled={alertSignIn || Boolean(chill.length)}
                            className={alertSignIn || Boolean(chill.length) ? undefined : "invisible"}
                        >
                            <p className="text-lg text-yellow-300">
                                {alertSignIn ? "please sign in" : chill.length ? chill : "🦀"}
                            </p>
                        </LoadingBounce>
                        <canvas ref={canvasRef} width={200} height={200} className="rounded max-w-[250px] max-h-[250px] bg-gradient-to-br from-[var(--clr-bg-500)] to-[var(--clr-bg-300)]" />
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
