import { default as NLink } from "next/link";
import { AnchorHTMLAttributes, FC, PropsWithChildren } from "react";
import { UrlObject } from "url";

type Url = string | UrlObject;
interface Props extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
    href: Url;
    plain?: boolean;
}

export const Link: FC<PropsWithChildren<Props>> = ({ children, className, plain, ...rest }) => {
    return (
        <NLink className={`${plain ? "" : "button-base"} ${className ? className : ""}`} {...rest}>
            {children}
        </NLink>
    );
};
