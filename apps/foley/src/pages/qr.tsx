import { makeCode, toDataURL, type QRCodeToDataURLOptions, type QRCodeSegment } from "qr";
import { Button, Input } from "ui";
import { getTextBytes, isHexCode } from "utils";
import Bounce from "@components/Animations/Bounce";
import Section from "@components/Section";
import { StorageKey, URLS } from "@utils/enums";
import { fontInconsolata, fontLondrinaSketch } from "@utils/font";
import { BrowserStorage } from "@utils/helpers";
import { origin } from "@utils/misc";
import { useSession } from "next-auth/react";
import { type NextPage } from "next/types";
import {
    type FormEvent,
    type ChangeEvent,
    createRef,
    startTransition,
    useCallback,
    useEffect,
    useMemo,
    useState,
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
    const patternInputRef = createRef<HTMLInputElement>();
    const backgroundInputRef = createRef<HTMLInputElement>();
    const errorElementRef = createRef<HTMLSpanElement>();

    const [loading, setLoading] = useState<boolean>(false);
    const [errMessage, setErrMessage] = useState<string>("");
    const [alertSignIn, setAlertSignIn] = useState<boolean>(false);
    const [pngUrl, setPngUrl] = useState<string | null>(null);
    const [svgUriCache, setSvgUriCache] = useState<string | null>(null);
    const [text, setText] = useState<string>("");
    const [qrColor, setQrColor] = useState<string>(DEFAULT_QR_COLOR);
    const [qrBgColor, setQrBgColor] = useState<string>(DEFAULT_BG_COLOR);
    const [qrMargin, setQrMargin] = useState<number>(DEFAULT_MARGIN);
    const [patternTransparent, setPatternTransparent] = useState<boolean>(false);
    const [backgroundTransparent, setBackgroundTransparent] = useState<boolean>(false);

    const isPatternColor = useMemo((): boolean => isHexCode(qrColor), [qrColor]);
    const isBackgroundColor = useMemo((): boolean => isHexCode(qrBgColor), [qrBgColor]);
    const qrOpts = useMemo((): QRCodeToDataURLOptions => {
        return {
            margin: qrMargin,
            width: 270,
            color: {
                dark: isPatternColor ? qrColor : DEFAULT_QR_COLOR,
                light: isBackgroundColor ? qrBgColor : DEFAULT_BG_COLOR,
            },
            rendererOpts: {
                quality: 1,
            },
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qrMargin, isPatternColor, isBackgroundColor]);

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
        svgUriCache && setSvgUriCache(null);

        if (e.target.name === "text") {
            if (!e.target.value.length) {
                setPngUrl(null);
            }

            e.target.value.length ?
                BrowserStorage.set(StorageKey.qrInput, e.target.value) :
                BrowserStorage.remove(StorageKey.qrInput);

            setText(e.target.value);
        } else if (e.target.name === "pattern" || e.target.name === "background") {
            if ((!e.target.value.startsWith("#") && e.target.value !== "") || e.target.value.length > 9) {
                return;
            }

            const key = e.target.name === "pattern" ? StorageKey.qrPatternColor : StorageKey.qrBackgroundColor;

            e.target.value.length ? BrowserStorage.set(key, e.target.value) : BrowserStorage.remove(key);
            e.target.name === "pattern" ? setQrColor(e.target.value) : setQrBgColor(e.target.value);
        } else {
            const margin = e.target.value.at(0) === "-" ? 2 : Number(e.target.value.charAt(e.target.value.length - 1));

            if (isNaN(margin) === true || margin > MAX_MARGIN || margin < 0) {
                return;
            }

            BrowserStorage.set(StorageKey.qrMargin, String(margin));
            setQrMargin(margin);
        }
    }, [svgUriCache]);

    const handleTransparent = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
        const isPattern = e.target.name === "pattern";
        const color = isPattern ? qrColor : qrBgColor;

        if (!isHexCode(color)) {
            if (isPattern && !patternInputRef.current?.classList.contains("motion-safe:animate-wiggle-translate")) {
                patternInputRef.current?.classList.add("motion-safe:animate-wiggle-translate");
                setTimeout(() => patternInputRef.current?.classList.remove("motion-safe:animate-wiggle-translate"), 769);
            } else if (!isPattern && !backgroundInputRef.current?.classList.contains("motion-safe:animate-wiggle-translate")) {
                backgroundInputRef.current?.classList.add("motion-safe:animate-wiggle-translate");
                setTimeout(() => backgroundInputRef.current?.classList.remove("motion-safe:animate-wiggle-translate"), 769);
            }

            return;
        }

        const key = isPattern ? StorageKey.qrPatternColor : StorageKey.qrBackgroundColor;
        const setColor = isPattern ? setQrColor : setQrBgColor;
        const setTransparent = isPattern ? setPatternTransparent : setBackgroundTransparent;

        setTransparent(e.target.checked);

        if (color.length === 4) {
            const newColor = `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}00`;

            setColor(newColor);
            BrowserStorage.set(key, newColor);

            return;
        }

        if (color.length === 7) {
            setColor(color + "00");
            BrowserStorage.set(key, color + "00");

            return;
        }

        if (color.length === 9 && !e.target.checked) {
            const newColor = color.slice(0, 7);

            setColor(newColor);
            BrowserStorage.set(key, newColor);

            return;
        }
    }, [qrColor, qrBgColor, patternInputRef, backgroundInputRef]);

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

                linkTag.href = result;
                linkTag.download = FILE_NAME;
                linkTag.click();

                setSvgUriCache(result);
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

            if (!(canvasRef.current || Boolean(text.length)) || getTextBytes(text) > 2953) {
                return;
            }

            toDataURL(
                canvasRef.current!,
                makeCode(text)
                    .segments
                    .map((segment) => ({ ...segment, mode: segment.mode.id } as unknown as QRCodeSegment)),
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
        const lsInput = BrowserStorage.get(StorageKey.qrInput);
        const lsPatternColor = BrowserStorage.get(StorageKey.qrPatternColor);
        const lsBackgroundColor = BrowserStorage.get(StorageKey.qrBackgroundColor);
        const lsMargin = BrowserStorage.get(StorageKey.qrMargin);

        if (lsInput) {
            setText(lsInput);
        }

        if (lsPatternColor) {
            setQrColor(lsPatternColor);

            if (lsPatternColor.length === 9) {
                setPatternTransparent(true);
            }
        }

        if (lsBackgroundColor) {
            setQrBgColor(lsBackgroundColor);

            if (lsBackgroundColor.length === 9) {
                setBackgroundTransparent(true);
            }
        }

        if (lsMargin) {
            setQrMargin(Number(lsMargin));
        }
    }, []);

    useEffect((): void => {
        if (!text.length) return;
        handleSubmit();
    }, [handleSubmit, qrBgColor, qrColor, text]);

    useEffect(() => {
        if (!errMessage.length) return;
        window.scrollTo({ top: 0, behavior: "smooth" });
        const timeoutMessage = setTimeout(() => setErrMessage(""), 7419);
        return () => clearTimeout(timeoutMessage);
    }, [errMessage]);

    return (
        <>
            <div className="flex sm:items-center items-start justify-center py-12 min-h-[70vh] bg-ivory dark:bg-black dark:text-white">
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
                                ref={errorElementRef}
                                enabled={alertSignIn || Boolean(errMessage.length)}
                                className={alertSignIn || Boolean(errMessage.length) ? undefined : "hidden"}
                            >
                                <p className="text-lg text-yellow">
                                    {alertSignIn ? "please sign in" : errMessage.length ? errMessage : "🦀"}
                                </p>
                            </Bounce>
                        </div>

                        <Input
                            value={text}
                            name="text"
                            placeholder="gib text, link or good vibes"
                            className="max-w-[25rem] w-full border-4 border-gray-300 placeholder-gray-400 dark:bg-black outline-[var(--clr-orange)] focus:outline-[var(--clr-orange)] focus:outline-dotted focus:outline-4"
                            maxLength={2953}
                            onChange={handleChange}
                        />
                    </form>

                    <div className="flex max-xs:flex-col xs:justify-center sm:gap-10 gap-6 max-sm:w-full max-xs:max-w-[17rem]">
                        <span>
                            <Input
                                ref={patternInputRef}
                                value={qrColor}
                                required={true}
                                name="pattern"
                                label="pattern color"
                                labelClass="sm:max-w-[9rem] whitespace-nowrap"
                                className={`block w-full sm:max-w-[9rem] border border-gray-300 placeholder-gray-400 dark:bg-black focus:outline-[var(--clr-orange)] focus:outline-dotted focus:outline-2 ${!isPatternColor ? "border-red-500" : ""}`}
                                maxLength={9}
                                placeholder="hex code"
                                onChange={handleChange}
                            />

                            <Input
                                checked={patternTransparent}
                                type="checkbox"
                                label="transparent"
                                name="pattern"
                                labelClass="mt-2 select-none cursor-pointer"
                                className="cursor-pointer border"
                                onChange={handleTransparent}
                            />
                        </span>

                        <span>
                            <Input
                                ref={backgroundInputRef}
                                value={qrBgColor}
                                required={true}
                                name="background"
                                label="background color"
                                labelClass="sm:max-w-[9rem] whitespace-nowrap"
                                className={`block w-full border border-gray-300 placeholder-gray-400 dark:bg-black focus:outline-[var(--clr-orange)] focus:outline-dotted focus:outline-2 ${!isBackgroundColor ? "border-red-500" : ""}`}
                                maxLength={9}
                                placeholder="hex code"
                                onChange={handleChange}
                            />

                            <Input
                                checked={backgroundTransparent}
                                type="checkbox"
                                label="transparent"
                                name="background"
                                labelClass="mt-2 select-none cursor-pointer"
                                className="cursor-pointer border"
                                onChange={handleTransparent}
                            />
                        </span>

                        <Input
                            value={qrMargin}
                            required={true}
                            name="margin"
                            type="number"
                            label="margin"
                            labelClass="sm:max-w-[9rem] whitespace-nowrap"
                            className="block w-full sm:max-w-[10rem] border border-gray-300 placeholder-gray-400 dark:bg-black focus:outline-[var(--clr-orange)] focus:outline-dotted focus:outline-2"
                            max={7}
                            placeholder="background color"
                            onChange={handleChange}
                        />
                    </div>
                </Section>
            </div>
        </>
    );
};

export default QRPage;
