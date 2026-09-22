import { type FC, type SelectHTMLAttributes, useId } from "react";
import { FieldShell } from "./FieldShell";

type Option = { value: string; label: string };

interface Props extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> {
    label?: string;
    labelClass?: string;
    error?: string;
    options: Option[];
}

export const Select: FC<Props> = ({
    className,
    label,
    labelClass,
    error,
    options,
    ...rest
}) => {
    const id = useId();

    return (
        <FieldShell
            id={id}
            label={label}
            labelClass={labelClass}
            required={rest.required}
            error={error}
        >
            <select
                id={id}
                className={`${className ?? ""} input-base`}
                {...rest}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </FieldShell>
    );
};
