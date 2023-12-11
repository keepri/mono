import { FC, useId, type TextareaHTMLAttributes } from "react";

interface Props extends TextareaHTMLAttributes<Omit<HTMLTextAreaElement, "id">> {
    initialValue?: string;
    label?: string;
    labelClassName?: string;
}

export const Textarea: FC<Props> = ({ className, labelClassName, initialValue, label, ...rest }) => {
    const id = useId();

    return (
        <>
            {label && <label htmlFor={id} className={labelClassName}>{label}{rest.required && <sup className="text-red-600">*</sup>}</label>}

            <textarea id={id} className={`${className ?? ""} input-base`} {...rest}>
                {initialValue}
            </textarea>
        </>
    );
};
