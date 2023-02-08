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
	type: "file";
	onChange: InputOnChange;
	label: string;
	index?: number;
	labelclass?: string;
};

type Type2 = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "type"> & {
	type?: Exclude<HTMLInputTypeAttribute, "file">;
	index?: number;
	onChange: InputOnChange;
};

type Props = Type1 | Type2;

export const Input = forwardRef<HTMLInputElement, PropsWithRef<Props>>(
    ({ type = "text", className, index, value, onChange, ...rest }, ref) => {
        const id = useId();

        const handleChange = useCallback(
            (e: ChangeEvent<HTMLInputElement>) => {
                onChange(e, index);
            },
            [index, onChange]
        );

        if (type.toLowerCase() === "file") {
            const labelclass = "labelclass" in rest ? rest.labelclass : undefined;
            const label = "label" in rest ? rest.label : undefined;

            return (
                <label className={`button-base ${labelclass}`} htmlFor={id}>
                    {label ?? "gib file"}
                    <input
                        id={id}
                        ref={ref}
                        type={type}
                        value={value}
                        className={`hidden ${className}`}
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
