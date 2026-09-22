import { type FC, type ReactNode } from "react";

interface Props {
    id?: string;
    label?: string;
    labelClass?: string;
    required?: boolean;
    error?: string;
    children: ReactNode;
}

export const FieldShell: FC<Props> = ({
    id,
    label,
    labelClass,
    required,
    error,
    children,
}) => {
    return (
        <label htmlFor={id} className={`${labelClass ?? ""} flex flex-col`}>
            {label && (
                <span>
                    {label}
                    {required && <sup className="text-red-600">*</sup>}
                </span>
            )}
            {children}
            {error && <p className="text-red-600 text-sm">{error}</p>}
        </label>
    );
};
