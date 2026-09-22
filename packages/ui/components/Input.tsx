import {
    type ChangeEventHandler,
    type HTMLInputTypeAttribute,
    type InputHTMLAttributes,
    type PropsWithRef,
    useId,
    forwardRef,
} from "react";
import { FieldShell } from "./FieldShell";

type Type1 = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "type" | "id"
> & {
    type: "file";
    label: string;
    labelClass?: string;
    error?: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
};

type Type2 = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "type"
> & {
    type?: Exclude<HTMLInputTypeAttribute, "file">;
    label?: string;
    labelClass?: string;
    error?: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
};

type Props = Type1 | Type2;

export const Input = forwardRef<HTMLInputElement, PropsWithRef<Props>>(
    (
        {
            type = "text",
            className,
            value,
            label,
            labelClass,
            error,
            onChange,
            ...rest
        },
        ref
    ) => {
        const id = useId();
        const base = { id, ref, onChange, ...rest };
        const errorEl = error && (
            <p className="text-red-600 text-sm">{error}</p>
        );

        if (type.toLowerCase() === "checkbox") {
            return (
                <label
                    className={`${labelClass} flex flex-wrap items-center gap-2`}
                    htmlFor={id}
                >
                    <input
                        type="checkbox"
                        value={value}
                        className={className}
                        {...base}
                    />
                    <span>
                        {label}
                        {rest.required && <sup className="text-red-600">*</sup>}
                    </span>
                    {errorEl}
                </label>
            );
        }

        const labelText = label ?? (type === "file" ? "gib file" : undefined);

        if (labelText) {
            return (
                <FieldShell
                    id={id}
                    label={labelText}
                    labelClass={labelClass}
                    required={rest.required}
                    error={error}
                >
                    <input
                        type={type}
                        value={value}
                        className={`${className} input-base`}
                        {...base}
                    />
                </FieldShell>
            );
        }

        return (
            <>
                <input
                    type={type}
                    value={value}
                    className={`${className} input-base`}
                    {...base}
                />
                {errorEl}
            </>
        );
    }
);
