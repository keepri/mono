import { default as NLink } from "next/link";
import { AnchorHTMLAttributes, FC, PropsWithChildren } from "react";
import { UrlObject } from "url";

type Url = string | UrlObject;

interface Props extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
    href: Url;
    button?: boolean;
}

export const Link: FC<PropsWithChildren<Props>> = ({ children, className, button, ...rest }) => {
    return (
        <NLink className={`${button ? "button-base" : ""} ${className ? className : ""}`} {...rest}>
            {children}
        </NLink>
    );
};
