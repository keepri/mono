import {
    type ChangeEvent,
    type HTMLInputTypeAttribute,
    type InputHTMLAttributes,
    type PropsWithRef,
    useId,
    forwardRef,
} from "react";

export type InputOnChange = (e: ChangeEvent<HTMLInputElement>, index?: number) => void;

type Type1 = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "type" | "id"> & {
    index?: number;
    type: "file";
    label: string;
    labelClass ?: string;
    onChange: InputOnChange;
};

type Type2 = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "type"> & {
    index?: number;
    type?: Exclude<HTMLInputTypeAttribute, "file">;
    label?: string;
    labelClass?: string;
    onChange: InputOnChange;
};

type Props = Type1 | Type2;

export const Input = forwardRef<HTMLInputElement, PropsWithRef<Props>>(({
    type = "text",
    className,
    index,
    value,
    label,
    labelClass,
    onChange,
    ...rest
}, ref) => {
    const id = useId();

    if (type.toLowerCase() === "checkbox") {
        if (label) {
            return (
                <label className={`${labelClass} flex flex-wrap items-center gap-2`} htmlFor={id}>
                    <input
                        id={id}
                        ref={ref}
                        data-index={index}
                        type="checkbox"
                        value={value}
                        className={className}
                        onChange={onChange}
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
                data-index={index}
                type="checkbox"
                value={value}
                className={className}
                onChange={onChange}
                {...rest}
            />
        );
    }

    if (type.toLowerCase() === "file") {
        // FIXME this is wrong, change it
        return (
            <label htmlFor={id} className={`input-base ${labelClass}`}>
                {label ?? "gib file"}
                <input
                    id={id}
                    ref={ref}
                    data-index={index}
                    type="file"
                    value={value}
                    className={className}
                    onChange={onChange}
                    {...rest}
                />
            </label>
        );
    }

    if (label) {
        return (
            <label htmlFor={id} className={`${labelClass ?? ""} flex flex-col`}>
                <span>{label}{rest.required && <sup className="text-red-600">*</sup>}</span>
                <input
                    id={id}
                    ref={ref}
                    data-index={index}
                    type={type}
                    value={value}
                    className={`${className} input-base`}
                    onChange={onChange}
                    {...rest}
                />
            </label>
        );
    }

    return (
        <input
            id={id}
            ref={ref}
            data-index={index}
            value={value}
            className={`${className} input-base`}
            type={type}
            onChange={onChange}
            {...rest}
        />
    );
}
);
