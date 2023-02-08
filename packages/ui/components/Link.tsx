import { default as NLink } from "next/link";
import { AnchorHTMLAttributes, FC, PropsWithChildren } from "react";

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> { }

export const Link: FC<PropsWithChildren<Props>> = ({ children, className, ...rest }) => {
    return (
        <NLink className={`button-base ${className}`} {...rest}>
            {children}
        </NLink>
    );
};
