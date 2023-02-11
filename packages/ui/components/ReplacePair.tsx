import { ChangeEvent, createRef, forwardRef, InputHTMLAttributes, PropsWithRef, useCallback, useId } from "react";
import { Button } from "./Button";

type ReplacePairProps = Omit<InputHTMLAttributes<HTMLInputElement>, "placeholder" | "id" | "name" | "onChange">;

interface Props extends ReplacePairProps {
    replace?: string;
    replaceValue?: string;
    wrapperClass?: string;
    labelClass?: string;
    placeholder1?: string;
    placeholder2?: string;
    label1?: string;
    label2?: string;
    index?: number;
    remove?: (index: number) => void;
    clear?: (index: number) => void;
    onChange: (e: ChangeEvent<HTMLInputElement>, index: number) => void;
}

export const ReplacePair = forwardRef<HTMLSpanElement, PropsWithRef<Props>>(
    (
        {
            index,
            className,
            wrapperClass,
            labelClass,
            replace,
            replaceValue,
            placeholder1,
            placeholder2,
            label1,
            label2,
            onChange,
            remove,
            clear,
            ...rest
        },
        ref
    ) => {
        const inputRef1 = createRef<HTMLInputElement>();
        const inputRef2 = createRef<HTMLInputElement>();

        const id = useId();

        const handleRemove = useCallback(() => {
            if (!remove || typeof index !== "number") return;
            remove(index);
        }, [remove, index]);

        const handleClear = useCallback(() => {
            if (!clear || typeof index !== "number") return;
            clear(index);
        }, [clear, index]);

        const handleInputChange = useCallback(
            (e: ChangeEvent<HTMLInputElement>) => {
                if (typeof index !== "number") return;
                onChange(e, index);
            },
            [onChange, index]
        );

        return (
            <span ref={ref} id={id} className={`flex justify-center items-center flex-wrap gap-2 ${wrapperClass}`}>
                {label1 && <label className={`text-sm leading-none text-left w-full ${labelClass}`}>{label1}</label>}
                <input
                    ref={inputRef1}
                    name="replace"
                    className={`input-base max-w-full ${className}`}
                    value={replace}
                    placeholder={placeholder1 ?? "replace"}
                    onChange={handleInputChange}
                    {...rest}
                />
                {label2 && <label className={`text-sm leading-none text-left w-full ${labelClass}`}>{label2}</label>}
                <input
                    ref={inputRef2}
                    name="replaceValue"
                    className={`input-base max-w-full ${className}`}
                    value={replaceValue}
                    placeholder={placeholder2 ?? "with"}
                    onChange={handleInputChange}
                    {...rest}
                />
                {Boolean(clear || remove) && (
                    <div className="flex justify-between flex-wrap gap-2 w-full">
                        {Boolean(clear) && (
                            <Button className="text-xs flex-1 bg-white" onClick={handleClear}>
                                clear
                            </Button>
                        )}
                        {Boolean(remove) && (
                            <Button varient="dark" className="text-xs flex-1" onClick={handleRemove}>
                                remove
                            </Button>
                        )}
                    </div>
                )}
            </span>
        );
    }
);
