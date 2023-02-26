import { ButtonHTMLAttributes, FC, PropsWithChildren } from "react";

export type ButtonVarient = "dark";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    varient?: ButtonVarient,
};

export const Button: FC<PropsWithChildren<Props>> = ({ children, varient, className, ...rest }) => {
    return (
        <button
            className={`button-base ${className ? className : ""} ${varient ? `button-varient-${varient}` : ""}`}
            {...rest}
        >
            {children}
        </button>
    );
};
