import { type FC, type TextareaHTMLAttributes, useId } from "react";
import { FieldShell } from "./FieldShell";

interface Props
    extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> {
    label?: string;
    labelClass?: string;
    error?: string;
}

export const Textarea: FC<Props> = ({
    className,
    labelClass,
    label,
    error,
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
            <textarea
                id={id}
                className={`${className ?? ""} input-base`}
                {...rest}
            />
        </FieldShell>
    );
};
