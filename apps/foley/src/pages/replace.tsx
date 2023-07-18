import { Button, ReplacePair, Textarea, type ReplacePairName } from "ui";
import { fontInconsolata } from "@utils/font";
import type { NextPage } from "next/types";
import { ChangeEvent, ChangeEventHandler, useCallback, useEffect, useMemo, useState } from "react";

type Declaration = Record<ReplacePairName, string>;

const initDeclaration: Declaration = { replace: "", replaceValue: "" } as const;

const ReplaceTextPage: NextPage = () => {
    const [declarations, updateDeclarations] = useState<Declaration[]>([initDeclaration]);
    const [input, updateInput] = useState<string>("");
    const [output, updateOutput] = useState<string>("");

    const extraDeclarationIndexes: Array<number> | null = useMemo(() => {
        if (declarations.length === 1) {
            return null;
        }

        return declarations.map((_, index) => index).filter(Boolean);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [declarations.length]);

    const handleChangeReplacePair = useCallback((e: ChangeEvent<HTMLInputElement>, index: number) => {
        updateDeclarations((d) => d.map((declaration, idx) => index === idx ?
            { ...declaration, [e.target.name]: e.target.value } :
            declaration)
        );
    }, []);

    const handleClearReplacePair = useCallback((index: number) => {
        updateDeclarations((d) => d.map((declaration, idx) => (index === idx ? initDeclaration : declaration)));
    }, []);

    const handleOutputChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback((e) => {
        updateOutput(e.target.value);
    }, []);

    const handleInputChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback((e) => {
        updateInput(e.target.value);
    }, []);

    const handleAddReplacePair = useCallback(() => {
        updateDeclarations((d) => d.concat(initDeclaration));
    }, []);

    const handleRemoveReplacePair = useCallback((index: number) => {
        if (declarations.length === 1) {
            return;
        }

        updateDeclarations((d) => d.filter((_, i) => i !== index));
    }, [declarations.length]);

    const handleSubmit = useCallback(() => {
        if (!input?.length) {
            return;
        }

        let output = String(input);

        for (const declaration of declarations) {
            if (!declaration.replace.length || !declaration.replaceValue.length) {
                continue;
            }

            output = output.split(declaration.replace).join(declaration.replaceValue);
        }

        updateOutput(output);
    }, [declarations, input]);

    useEffect(() => {
        document.removeEventListener("keydown", listener);
        document.addEventListener("keydown", listener);

        function listener(e: DocumentEventMap["keydown"]) {
            if (e.metaKey && e.code.toLowerCase() === "enter") {
                handleSubmit();
            }
        }

        return () => document.removeEventListener("keydown", listener);
    }, [handleSubmit]);

    return (
        <div className="grid sm:grid-cols-[minmax(0,_20rem),_1fr] grid-flow-row min-h-screen bg-ivory dark:bg-black dark:text-white overflow-y-hidden">
            <aside className="relative flex flex-col flex-1 gap-2.5 py-4 overflow-y-scroll max-sm:max-h-72 max-h-screen max-sm:border-b">
                <div className="sticky top-0 py-[.15em] bg-white dark:bg-black">
                    <Button
                        className={`button w-full my-2 !py-2 bg-white dark:bg-black border-black dark:border-white ${fontInconsolata}`}
                        onClick={handleAddReplacePair}
                    >
                        +
                    </Button>
                </div>

                <ReplacePair
                    key={"replace-pair-" + 1}
                    index={0}
                    replace={declarations[0].replace}
                    replaceValue={declarations[0].replaceValue}
                    label1="replace"
                    label2="with"
                    wrapperClass={`p-2 border border-black dark:border-white rounded-md ${fontInconsolata}`}
                    button1Class="button bg-white dark:bg-black border-black dark:border-white"
                    button2Class="button bg-white dark:bg-black border-black dark:border-white"
                    className="w-full border border-black dark:border-white dark:bg-black placeholder-gray-500"
                    onChange={handleChangeReplacePair}
                    clear={handleClearReplacePair}
                    remove={handleRemoveReplacePair}
                />

                {extraDeclarationIndexes && extraDeclarationIndexes.map((index) => {
                    return <ReplacePair
                        key={"replace-pair-" + (index + 1)}
                        index={index}
                        replace={declarations[index].replace}
                        replaceValue={declarations[index].replaceValue}
                        label1="replace"
                        label2="with"
                        wrapperClass={`p-2 border border-black dark:border-white rounded-md ${fontInconsolata}`}
                        button1Class="button bg-white dark:bg-black border-black dark:border-white"
                        button2Class="button bg-white dark:bg-black border-black dark:border-white"
                        className="w-full border border-black dark:border-white dark:bg-black placeholder-gray-500"
                        onChange={handleChangeReplacePair}
                        clear={handleClearReplacePair}
                        remove={handleRemoveReplacePair}
                    />;
                })}
            </aside>

            <section className="flex flex-col gap-2">
                <Textarea
                    className={`flex-1 border border-black dark:border-white dark:bg-black placeholder-gray-500 ${fontInconsolata}`}
                    placeholder="Input"
                    value={input}
                    onChange={handleInputChange}
                />

                <Textarea
                    className={`flex-[2] border border-black dark:border-white dark:bg-black placeholder-gray-500 ${fontInconsolata}`}
                    placeholder="Output"
                    value={output}
                    onChange={handleOutputChange}
                />

                <div className="min-h-[50px] rounded-md">
                    <Button className={`button w-full h-full bg-white dark:bg-black border-black dark:border-white ${fontInconsolata}`} onClick={handleSubmit}>
                        boop
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default ReplaceTextPage;
