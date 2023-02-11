import { QRCodeToDataURLOptions, toDataURL } from "@clfxc/services/qr";
import { Button, Input, InputOnChange } from "@clfxc/ui";
import { Storage } from "@declarations/enums";
import { getTextBytes, makeCode } from "@utils/helpers";
import { origin, underdog } from "@utils/misc";
import { NextPage } from "next/types";
import { createRef, FormEvent, startTransition, useCallback, useEffect, useState } from "react";

const QRCodePage: NextPage = () => {
    const DEFAULT_MARGIN: number = 2;
    const MAX_MARGIN: number = 7;
    const QR_OPTIONS = {
        margin: typeof window !== "undefined" ? +(localStorage.getItem(Storage.qrMargin) || DEFAULT_MARGIN) : DEFAULT_MARGIN,
        width: 200,
        color: {
            light: typeof window !== "undefined" ? localStorage.getItem(Storage.qrBackgroundColor) || "#ffffff" : "#ffffff",
            dark: typeof window !== "undefined" ? localStorage.getItem(Storage.qrPatternColor) || "#000000" : "#000000",
        },
        rendererOpts: {
            quality: 1,
        },
    } satisfies QRCodeToDataURLOptions;

    const canvasRef = createRef<HTMLCanvasElement>();

    const [text, setText] = useState<string>("");
    // TODO:
    const selectedFile = null;
    // const [selectedFile, setSelectedFile] = useState<File | null>(null);
    // const [code, setCode] = useState<QRCode | null>(null);
    const [pngUrl, setPngUrl] = useState<string | null>(null);
    const [svgUrl, setSvgUrl] = useState<string | null>(null);
    const [qrOpts, setQrOpts] = useState<QRCodeToDataURLOptions>(QR_OPTIONS);

    // const fileSize = useMemo(() => toKB(selectedFile?.size ?? -1), [selectedFile]);

    const handleChangeInput: InputOnChange = useCallback((e) => {
        const name = e.target.name;
        const value = e.target.value;

        if (name === "qr-input") {
            setText(e.target.value);
        }

        if (name === "qr-margin") {
            const parsed = value.startsWith("0") ? Number(value.slice(1, value.length)) : Number(value);
            const isValid = isNaN(parsed) === false && parsed <= MAX_MARGIN && parsed >= 0;
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

    const handleSubmit = useCallback(
        async (e?: FormEvent<HTMLFormElement>) => {
            try {
                e && e.preventDefault();
                if (!canvasRef.current) return;

                // no file has been uploaded
                if (!selectedFile) {
                    if (!Boolean(text.length)) return;

                    const bytes = getTextBytes(text);
                    if (bytes > 2953) return;

                    const code = await makeCode(text);

                    startTransition(() => {
                        const headers = new Headers();
                        headers.set("Content-Type", "application/json");
                        fetch(origin + "/api/qr/create", {
                            method: "POST",
                            body: JSON.stringify({ data: text, options: qrOpts }),
                            headers,
                        })
                            .then(async (res) => await res.json())
                            .then((json) => setSvgUrl(json?.file))
                            .catch((err) => console.error("json error:", err));

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


                    });
                    return;
                }

                // handle file uploaded creation
                // readFileAsDataUrl(selectedFile, async (e) => {
                //     const data = e.target?.result as string;
                //     if (!data) return;
                //     makeCode(data);
                // });
            } catch (error) {
                console.error("submit failed", error);
            }
        },
        [canvasRef, qrOpts, selectedFile, text]
    );

    useEffect(() => {
        if (!pngUrl) return;
        handleSubmit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qrOpts.color?.dark, qrOpts.color?.light, qrOpts.margin]);

    return (
        <>
            <main className="grid grid-cols-[repeat(auto-fit,_minmax(15rem,_1fr))] sm:gap-0 gap-8 p-4 min-h-screen bg-[var(--clr-bg-300)]">
                <section className="flex flex-col items-center sm:justify-center xl:gap-24 gap-8">
                    <form className="flex flex-col items-center justify-center gap-8 px-2 w-full" onSubmit={handleSubmit}>
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
                            className="max-w-[30rem] w-full bg-[var(--clr-bg-500)] text-white border-4 outline-[var(--clr-orange)] focus:outline-offset-8 focus:outline-dashed"
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
                            <Button type="submit" className="button border-white text-white">
                                boop
                            </Button>
                        </div>
                    </form>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Input
                            label="pattern color"
                            labelclass="text-white font-light whitespace-nowrap"
                            className="text-[var(--clr-bg-500)] block"
                            value={qrOpts.color!.dark?.toUpperCase()}
                            placeholder="pattern color"
                            name="qr-color"
                            onChange={handleChangeInput}
                        />
                        <Input
                            label="background color"
                            labelclass="text-white font-light whitespace-nowrap"
                            className="text-[var(--clr-bg-500)] block"
                            value={qrOpts.color!.light?.toUpperCase()}
                            placeholder="background color"
                            name="qr-color-bg"
                            onChange={handleChangeInput}
                        />
                        <Input
                            type="number"
                            label="margin"
                            labelclass="text-white font-light whitespace-nowrap"
                            className="text-[var(--clr-bg-500)] block"
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
                <section className="flex flex-col justify-center gap-8">
                    <div className="flex flex-col items-center justify-center gap-8 flex-[1]">
                        <canvas ref={canvasRef} width={200} height={200} className="rounded max-w-[250px] max-h-[250px] bg-white" />
                        <div className="flex justify-around items-center gap-4">
                            <a
                                href={pngUrl ?? "#"}
                                download="i_gib_qr"
                                className={`button border-white text-white visited:text-white ${!pngUrl ? "invisible" : ""}`}>
                                png
                            </a>
                            <a
                                href={svgUrl ?? "#"}
                                download="i_gib_qr_svg"
                                className={`button border-white text-white visited:text-white ${!svgUrl ? "hidden" : ""}`}>
                                svg
                            </a>
                        </div>
                        <p className={`text-3xl ${!pngUrl && !svgUrl ? "invisible" : ""}`}>🚀</p>
                    </div>
                </section>
            </main>
        </>
    );
};

export default QRCodePage;
