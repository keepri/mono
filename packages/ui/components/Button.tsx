import { ButtonHTMLAttributes, FC, PropsWithChildren } from "react";
import { GitHub } from "./Svg";

export type ButtonVarient = "dark" | "sign-in";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    varient?: ButtonVarient;
    wrapperClassName?: string;
}


export const Button: FC<PropsWithChildren<Props>> = ({ children, varient, className, wrapperClassName, ...rest }) => {
    if (varient === "sign-in") {
        return (
            <span className={`group flex items-center justify-evenly pl-4 overflow-y-hidden ${wrapperClassName ? wrapperClassName : ""}`}>
                <div className="flex gap-4 items-center justify-center group-hover:translate-y-0 -translate-y-full group-hover:opacity-100 opacity-0 transition-transform duration-[150ms] delay-75">
                    <GitHub />
                </div>
                <button
                    className={`group-hover:text-[var(--clr-orange)] px-4 py-2 text-lg text-white font-medium transition-colors duration-100 ${className ? className : ""} ${varient ? `button-varient-${varient}` : ""}`}
                    {...rest}
                >
                    sign in
                </button>
            </span>
        );
    }

    return (
        <button
            className={`button-base ${className ? className : ""} ${varient ? `button-varient-${varient}` : ""}`}
            {...rest}
        >
            {children}
        </button>
    );
};
