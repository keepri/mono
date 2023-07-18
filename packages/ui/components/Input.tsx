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

export const Input = forwardRef<HTMLInputElement, PropsWithRef<Props>>(({
    type = "text",
    className,
    index,
    value,
    label,
    labelclass,
    onChange,
    ...rest
}, ref) => {
    const id = useId();

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        onChange(e, index);
    }, [index, onChange]);

    if (type.toLowerCase() === "checkbox") {
        if (label) {
            return (
                <label className={`${labelclass} flex flex-wrap items-center gap-2`} htmlFor={id}>
                    <input
                        id={id}
                        ref={ref}
                        type="checkbox"
                        value={value}
                        className={className}
                        onChange={handleChange}
                        {...rest}
                    />
                    <span>{label}{rest.required && <sup className="text-red-600">*</sup>}</span>
                </label>
            );
        }

        return (
            <input
                id={id}
                ref={ref}
                type="checkbox"
                value={value}
                className={className}
                onChange={handleChange}
                {...rest}
            />
        );
    }

    if (type.toLowerCase() === "file") {
        // FIXME this is wrong, change it
        return (
            <label htmlFor={id} className={`input-base ${labelclass}`}>
                {label ?? "gib file"}
                <input
                    id={id}
                    ref={ref}
                    type="file"
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
            <label htmlFor={id} className={`${labelclass ?? ""} flex flex-col`}>
                <span>{label}{rest.required && <sup className="text-red-600">*</sup>}</span>
                <input
                    id={id}
                    ref={ref}
                    type={type}
                    value={value}
                    className={`${className} input-base`}
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
            className={`${className} input-base`}
            type={type}
            onChange={handleChange}
            {...rest}
        />
    );
}
);
