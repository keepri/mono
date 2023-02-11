import {
    ChangeEvent,
    forwardRef,
    HTMLInputTypeAttribute,
    InputHTMLAttributes,
    PropsWithRef,
    useCallback,
    useId,
} from "react";

export type InputOnChange = (e: ChangeEvent<HTMLInputElement>, index?: number) => void;

type Type1 = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "type" | "id"> & {
    index?: number;
    type: "file";
    label: string;
    labelclass?: string;
    onChange: InputOnChange;
};

type Type2 = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "type"> & {
    index?: number;
    type?: Exclude<HTMLInputTypeAttribute, "file">;
    label?: string;
    labelclass?: string;
    onChange: InputOnChange;
};

type Props = Type1 | Type2;

export const Input = forwardRef<HTMLInputElement, PropsWithRef<Props>>(
    ({ type = "text", className, index, value, onChange, label, labelclass, ...rest }, ref) => {
        const id = useId();

        const handleChange = useCallback(
            (e: ChangeEvent<HTMLInputElement>) => {
                onChange(e, index);
            },
            [index, onChange]
        );

        if (type.toLowerCase() === "file") {

            return (
                <label className={`input-base ${labelclass}`} htmlFor={id}>
                    {label ?? "gib file"}
                    <input
                        id={id}
                        ref={ref}
                        type={type}
                        value={value}
                        className={className}
                        onChange={handleChange}
                        {...rest}
                    />
                </label>
            );
        }

        if (label) {
            return (
                <label className={labelclass} htmlFor={id}>
                    {label ?? "gib"}
                    <input
                        id={id}
                        ref={ref}
                        type={type}
                        value={value}
                        className={`input-base ${className}`}
                        onChange={handleChange}
                        {...rest}
                    />
                </label>

            );
        }

        return (
            <input
                ref={ref}
                value={value}
                className={`input-base ${className}`}
                type={type}
                onChange={handleChange}
                {...rest}
            />
        );
    }
);
