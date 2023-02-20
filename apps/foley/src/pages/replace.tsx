import type { ReplacePairName } from "@clfxc/ui";
import { Button, ReplacePair, Textarea } from "@clfxc/ui";
import type { NextPage } from "next/types";
import { ChangeEvent, ChangeEventHandler, useCallback, useEffect, useState } from "react";

type Declaration = Record<ReplacePairName, string>;

const initDeclaration: Declaration = { replace: "", replaceValue: "" };

const ReplaceTextPage: NextPage = () => {
    const [declarations, updateDeclarations] = useState<Declaration[]>([initDeclaration]);
    const [input, updateInput] = useState<string>("");
    const [output, updateOutput] = useState<string>("");

    const handleChangeReplacePair = useCallback((e: ChangeEvent<HTMLInputElement>, index: number) => {
        updateDeclarations((d) => {
            const target = e.target;
            const name = target.name as ReplacePairName;
            const value = target.value;
            const newDeclarations = d.map((declaration, idx) =>
                index === idx ? { ...declaration, [name]: value } : declaration
            );

            return newDeclarations;
        });
    }, []);

    const handleClearReplacePair = useCallback((index: number) => {
        updateDeclarations((d) => {
            // eslint-disable-next-line max-len
            const newDeclarations = d.map((declaration, idx) => (index === idx ? initDeclaration : declaration));

            return newDeclarations;
        });
    }, []);

    const handleOutputChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback((e) => {
        updateOutput(e.target.value);
    }, []);

    const handleInputChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback((e) => {
        updateInput(e.target.value);
    }, []);

    const handleAddReplacePair = useCallback(() => {
        updateDeclarations((d) => [...d, initDeclaration]);
    }, []);

    const handleRemoveReplacePair = useCallback(
        (index: number) => {
            declarations.length > 1 && updateDeclarations((d) => [...d].filter((_, i) => i !== index));
        },
        [declarations.length]
    );

    const handleSubmit = useCallback(() => {
        if (!input?.length) return;
        let output: string = String(input);

        for (const declaration of declarations) {
            if (!declaration.replace.length || !declaration.replaceValue.length) continue;
            const newOutput = output.split(declaration.replace).join(declaration.replaceValue);
            output = newOutput;
        }

        updateOutput(output);
    }, [declarations, input]);

    // submit key combination event listener
    useEffect(() => {
        const listener = (e: DocumentEventMap["keydown"]) => {
            const isMetaKey = e.metaKey;
            const isEnterKey = e.code.toLowerCase() === "enter";
            isMetaKey && isEnterKey && handleSubmit();
        };

        document.removeEventListener("keydown", listener);
        document.addEventListener("keydown", listener);

        return () => document.removeEventListener("keydown", listener);
    }, [handleSubmit]);

    return (
        <div className="grid sm:grid-cols-[minmax(0,_20rem),_1fr] grid-flow-row h-screen overflow-y-hidden">
            <aside className="relative flex flex-col flex-1 gap-2.5 p-2 bg-[var(--clr-bg-300)] overflow-y-scroll">
                <div className="sticky top-0 bg-[var(--clr-bg-300)] py-[.15em]">
                    <Button className="button w-full my-1 border-white text-white" onClick={handleAddReplacePair}>
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
                    wrapperClass="p-2 bg-[var(--clr-bg-500)] border border-[var(--clr-orange)] rounded-md"
                    button1Class="text-white border-white"
                    button2Class="text-white border-white"
                    className="w-full bg-[var(--clr-bg-500)] border boder-white text-white"
                    labelClass="text-white"
                    onChange={handleChangeReplacePair}
                    clear={handleClearReplacePair}
                    remove={handleRemoveReplacePair}
                />
                {Boolean(declarations.length > 1) &&
                    declarations.map(
                        ({ replace, replaceValue }, index) =>
                            index > 0 && (
                                <ReplacePair
                                    key={"replace-pair-" + index + 1}
                                    index={index}
                                    replace={replace}
                                    replaceValue={replaceValue}
                                    label1="replace"
                                    label2="with"
                                    wrapperClass={`p-2 bg-[var(--clr-bg-500)] border border-[var(--clr-orange)] rounded-md`}
                                    button1Class="text-white border-white"
                                    button2Class="text-white border-white"
                                    className="w-full bg-[var(--clr-bg-500)] border boder-white text-white"
                                    labelClass="text-white"
                                    onChange={handleChangeReplacePair}
                                    clear={handleClearReplacePair}
                                    remove={handleRemoveReplacePair}
                                />
                            )
                    )}
            </aside>
            <section className="flex flex-col gap-2 p-2 bg-[var(--clr-bg-300)] min-h-[67vh]">
                <Textarea
                    className="flex-1 border border-white text-white bg-[var(--clr-bg-500)]"
                    placeholder="Input"
                    value={input}
                    onChange={handleInputChange}
                />
                <Textarea
                    className="flex-1 border border-white text-white bg-[var(--clr-bg-500)]"
                    placeholder="Output"
                    value={output}
                    onChange={handleOutputChange}
                />
                <div className="min-h-[50px] rounded-md">
                    <Button className="w-full h-full border-white text-white" onClick={handleSubmit}>
                        boop
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default ReplaceTextPage;
