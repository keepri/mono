import { makeCode, toDataURL, type QRCodeToDataURLOptions, type QRCodeSegment } from "qr";
import { Button, Input, type InputOnChange } from "ui";
import { getTextBytes, isHexCode } from "utils";
import Bounce from "@components/Animations/Bounce";
import { Section } from "@components/Section";
import { StorageKey, URLS } from "@utils/enums";
import { fontInconsolata, fontLondrinaSketch } from "@utils/font";
import { BrowserStorage } from "@utils/helpers";
import { origin } from "@utils/misc";
import { useSession } from "next-auth/react";
import { type NextPage } from "next/types";
import {
    createRef,
    startTransition,
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ChangeEventHandler,
    type FormEvent,
} from "react";

const FILE_NAME = "gib_qr" as const;
const MAX_MARGIN: number = 7;
const DEFAULT_MARGIN: number = 2;
const DEFAULT_QR_COLOR = "#000000" as const;
const DEFAULT_BG_COLOR = "#FFFFFF" as const;

const QRPage: NextPage = () => {
    const session = useSession();
    const isAuthenticated = session.status === "authenticated";

    const canvasRef = createRef<HTMLCanvasElement>();

    const [errMessage, setErrMessage] = useState<string>("");
    const [alertSignIn, setAlertSignIn] = useState<boolean>(false);
    const [text, setText] = useState<string>("");
    const [svgUriCache, setSvgUriCache] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [pngUrl, setPngUrl] = useState<string | null>(null);
    const [qrColor, setQrColor] = useState<string>(typeof window !== "undefined" ?
        BrowserStorage.get(StorageKey.qrPatternColor) || DEFAULT_QR_COLOR :
        DEFAULT_QR_COLOR
    );
    const [qrBgColor, setQrBgColor] = useState<string>(typeof window !== "undefined" ?
        BrowserStorage.get(StorageKey.qrBackgroundColor) || DEFAULT_BG_COLOR :
        DEFAULT_BG_COLOR
    );
    const [qrMargin, setQrMargin] = useState<number>(typeof window !== "undefined" ?
        +(BrowserStorage.get(StorageKey.qrMargin) || DEFAULT_MARGIN) :
        DEFAULT_MARGIN
    );

    const qrOpts = useMemo((): QRCodeToDataURLOptions => {
        return {
            margin: qrMargin,
            width: 270,
            color: {
                dark: qrColor,
                light: qrBgColor,
            },
            rendererOpts: {
                quality: 1,
            },
        };
    }, [qrMargin, qrColor, qrBgColor]);

    const handleToggleTransparent: ChangeEventHandler<HTMLInputElement> = useCallback((e): void => {
        const color = e.target.name === "pattern" ? qrColor : qrBgColor;
        const setColor = e.target.name === "pattern" ? setQrColor : setQrBgColor;

        if (!isHexCode(color)) {
            return;
        }

        if (color.length === 4) {
            if (!e.target.checked) {
                return;
            }

            setColor(`#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}00`);

            return;
        }

        if (color.length === 7) {
            if (!e.target.checked) {
                return;
            }

            setColor(color + "00");

            return;
        }

        if (color.length === 9) {
            if (e.target.checked) {
                return;
            }

            setColor(color.slice(0, 7));

            return;
        }
    }, [qrBgColor, qrColor]);

    const handleChangeInput: InputOnChange = useCallback((e): void => {
        const newText = e.target.value;

        // we clear the cache anytime the user tries to generate a new qr code
        setSvgUriCache(null);

        if (e.target.name === "qr-input") {
            if (!newText.length) {
                setPngUrl(null);
            }

            setText(newText);

            return;
        }

        if (e.target.name === "qr-margin") {
            const margin = newText.at(0) === "-" ? 0 : Number(newText.charAt(newText.length - 1));
            const isValid = isNaN(margin) === false && margin <= MAX_MARGIN && margin >= 0;

            if (!isValid) {
                return;
            }

            BrowserStorage.set(StorageKey.qrMargin, JSON.stringify(margin));

            setQrMargin(margin);

            return;
        }

        // --- colors block ---
        if ((!newText.startsWith("#") && newText !== "") || newText.length > 9) {
            return;
        }

        if (e.target.name === "qr-color-bg") {
            if (!newText.length) {
                BrowserStorage.remove(StorageKey.qrBackgroundColor);
            } else {
                BrowserStorage.set(StorageKey.qrBackgroundColor, newText);
            }

            setQrBgColor(newText.length ? newText : DEFAULT_BG_COLOR);

            return;
        }

        if (e.target.name === "qr-color") {
            if (!newText.length) {
                BrowserStorage.remove(StorageKey.qrPatternColor);
            } else {
                BrowserStorage.set(StorageKey.qrPatternColor, newText);
            }

            setQrColor(newText.length ? newText : DEFAULT_QR_COLOR);

            return;
        }
        // --- colors block ---
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

    const handleSvgDownload = useCallback(async (): Promise<void> => {
        if (!isAuthenticated) {
            setAlertSignIn(true);
            setTimeout(() => setAlertSignIn(false), 2769);

            return;
        }

        setLoading(true);

        startTransition(() => {
            const linkTag = document.createElement("a");

            if (svgUriCache) {
                linkTag.href = svgUriCache;
                linkTag.download = FILE_NAME;
                linkTag.click();

                return;
            }

            const headers = new Headers();
            headers.set("Content-Type", "application/json");

            fetch(origin + URLS.API_QR_CREATE, {
                headers,
                method: "POST",
                body: JSON.stringify({ data: text, options: qrOpts }),
                credentials: "same-origin",
            }).then(async (res) => {
                const result = await res.text();

                if (res.status !== 200) {
                    console.error("failed with status:", res.status);
                    console.error("error message:", result);
                    setErrMessage("nope");

                    return;
                }

                setSvgUriCache(result);

                linkTag.href = result;
                linkTag.download = FILE_NAME;
                linkTag.click();
            }).catch((error) => {
                console.warn(error.stack);
                console.error("could not download svg", error.message);
            }).finally(() => {
                setLoading(false);
            });
        });
    }, [isAuthenticated, qrOpts, svgUriCache, text]);

    const handleSubmit = useCallback((e?: FormEvent<HTMLFormElement>): void => {
        try {
            e && e.preventDefault();

            if (!canvasRef.current) {
                return;
            }

            // if (selectedFile) {
            //     // handle file uploaded creation
            //     readFileAsDataUrl(selectedFile, async (e) => {
            //         const data = e.target?.result as string;
            //         if (!data) return;
            //         makeCode(data);
            //     });
            //
            //     return;
            // }

            if (!Boolean(text.length)) {
                return;
            }

            const bytes = getTextBytes(text);

            if (bytes > 2953) {
                return;
            }

            const code = makeCode(text);

            toDataURL(
                canvasRef.current!,
                code.segments.map((segment) => ({ ...segment, mode: segment.mode.id } as unknown as QRCodeSegment)),
                qrOpts,
                (error, url) => {
                    if (error) {
                        console.error(error.stack);
                        console.error("could not create code image", error.message);

                        return;
                    }

                    setPngUrl(url);

                    return;
                }
            );
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch ({ stack, message }: any) {
            console.error("submit failed", message);
        }
    }, [canvasRef, qrOpts, text]);

    useEffect((): void => {
        const isBackgroundLen = qrBgColor.length === 4 || qrBgColor.length === 7 || qrBgColor.length === 9;
        const isPatternLen = qrColor.length === 4 || qrColor.length === 7 || qrColor.length === 9;

        if (!text.length || !isBackgroundLen || !isPatternLen) {
            return;
        }

        handleSubmit();
    }, [handleSubmit, qrBgColor, qrColor, text]);

    useEffect(() => {
        if (!errMessage.length) {
            return;
        }

        const timeout = setTimeout(() => setErrMessage(""), 7419);

        return () => clearTimeout(timeout);
    }, [errMessage]);

    return (
        <>
            <div className="flex sm:items-center items-start justify-center py-12 bg-ivory dark:bg-black dark:text-white">
                <Section className="flex flex-col items-center justify-center gap-12">
                    <form className="flex flex-col items-center justify-center gap-8 w-full">
                        <div className="flex flex-col items-center justify-center gap-4 flex-[1]">
                            <div
                                className={`flex flex-col justify-center items-center max-xxs:gap-4 text-center leading-none ${pngUrl ? "hidden" : ""}`}
                            >
                                <h1 className={`max-xxs:text-8xl text-[200px] tracking-wide ${fontLondrinaSketch}`}>qr</h1>

                                <p className="xxs:mt-[-.75rem] xxs:ml-16 xxs:max-w-[4ch] xxs:text-left leading-none">code generator</p>
                            </div>

                            <canvas
                                ref={canvasRef}
                                width={150}
                                height={150}
                                className={`rounded max-w-[176px] max-h-[176px] w-[176px] h-[176px] border border-gray-300 placeholder-gray-400 ${!pngUrl ? "hidden" : ""}`}
                            />

                            <div className="flex justify-around items-center gap-4">
                                <a
                                    role="button"
                                    href={pngUrl ?? "#"}
                                    download={FILE_NAME}
                                    className={`button dark:border-white border-black ${fontInconsolata} ${!pngUrl ? "invisible" : ""}`}
                                >
                                    png
                                </a>

                                <Button
                                    disabled={loading}
                                    className={`button ${fontInconsolata} ${!pngUrl ? "invisible" : ""}`}
                                    onClick={handleSvgDownload}
                                >
                                    {loading ? "on it..." : "svg"}
                                </Button>
                            </div>

                            <p className={`text-xl ${!pngUrl || alertSignIn || Boolean(errMessage.length) ? "hidden" : ""}`}>
                                🚀
                            </p>

                            <Bounce
                                enabled={alertSignIn || Boolean(errMessage.length)}
                                className={alertSignIn || Boolean(errMessage.length) ? undefined : "hidden"}
                            >
                                <p className="text-lg text-yellow">
                                    {alertSignIn ? "please sign in" : errMessage.length ? errMessage : "🦀"}
                                </p>
                            </Bounce>
                        </div>

                        <Input
                            name="qr-input"
                            placeholder="gib text, link or good vibes"
                            value={text}
                            className={`max-w-[25rem] w-full border-4 border-gray-300 placeholder-gray-400 dark:bg-black outline-[var(--clr-orange)] focus:outline-[var(--clr-orange)] focus:outline-dotted focus:outline-4`}
                            onChange={handleChangeInput}
                        />
                        {
                            // <div aria-label="buttons" className="flex flex-wrap items-center justify-center gap-4">
                            //     <Input
                            //     type="file"
                            //     // TODO: TEMP: not done
                            //     labelclass="hidden hover:bg-[var(--clr-bg-500)] hover:border-[var(--clr-orange)] active:bg-[var(--clr-orange)] active:border-[var(--clr-bg-500)] active:scale-110"
                            //     onChange={handleChangeFile}
                            // />
                            // </div>
                        }
                    </form>

                    <div className="flex max-xs:flex-col xs:justify-center sm:gap-10 gap-6 max-sm:w-full max-xs:max-w-[17rem]">
                        <span>
                            <Input
                                label="pattern color"
                                labelclass="whitespace-nowrap"
                                className="block w-full sm:max-w-[9rem] border border-gray-300 placeholder-gray-400 dark:bg-black focus:outline-[var(--clr-orange)] focus:outline-dotted focus:outline-2"
                                value={qrColor}
                                placeholder="hex code"
                                name="qr-color"
                                onChange={handleChangeInput}
                            />

                            <Input
                                type="checkbox"
                                label="transparent"
                                labelclass="mt-2 select-none cursor-pointer"
                                className="cursor-pointer border"
                                name="pattern"
                                onChange={handleToggleTransparent}
                            />
                        </span>

                        <span>
                            <Input
                                label="background color"
                                labelclass="sm:max-w-[9rem] whitespace-nowrap"
                                className="block w-full border border-gray-300 placeholder-gray-400 dark:bg-black focus:outline-[var(--clr-orange)] focus:outline-dotted focus:outline-2"
                                value={qrBgColor}
                                placeholder="hex code"
                                name="qr-color-bg"
                                onChange={handleChangeInput}
                            />

                            <Input
                                type="checkbox"
                                label="transparent"
                                labelclass="mt-2 select-none cursor-pointer"
                                className="cursor-pointer border"
                                name="background"
                                onChange={handleToggleTransparent}
                            />
                        </span>

                        <Input
                            type="number"
                            label="margin"
                            labelclass="sm:max-w-[9rem] whitespace-nowrap"
                            className="block w-full sm:max-w-[10rem] border border-gray-300 placeholder-gray-400 dark:bg-black focus:outline-[var(--clr-orange)] focus:outline-dotted focus:outline-2"
                            value={qrMargin}
                            placeholder="background color"
                            name="qr-margin"
                            onChange={handleChangeInput}
                        />
                    </div>

                    {/* <p
					className={`flex flex-wrap items-center justify-center gap-4 text-center max-w-[40ch] text-xs sm:max-w-[unset] ${
						!selectedFile ? 'invisible' : ''
					}`}
				>
					{selectedFile?.name}{' '}
					<span className="px-2 py-2 ml-4 rounded bg-[var(--clr-orange)]">{selectedFile?.type.split('/')[1]}</span>
					<span className="px-2 py-2 rounded bg-[var(--clr-orange)]">
						{fileSize.toFixed(2)}kB {fileSize > 1000 ? '🚀' : ''}
					</span>
				</p> */}
                </Section>
            </div>
        </>
    );
};

export default QRPage;
