import { default as NLink } from "next/link";
import { AnchorHTMLAttributes, FC, PropsWithChildren } from "react";
import { UrlObject } from "url";

type Url = string | UrlObject;

interface Props extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
    active?: boolean;
    activeClassName?: string;
    href: Url;
    button?: boolean;
}

export const Link: FC<PropsWithChildren<Props>> = ({
    children,
    className,
    button,
    active,
    activeClassName,
    ...rest
}) => {
    return (
        <NLink className={`${button ? "button-base" : ""} ${active ? activeClassName : ""} ${className ? className : ""}`} {...rest}>
            {children}
        </NLink>
    );
};
