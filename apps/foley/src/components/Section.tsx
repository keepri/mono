import { type HTMLAttributes, type PropsWithChildren } from "react";

type Props = PropsWithChildren<HTMLAttributes<HTMLElement>>;

export default function Section({ children, className, ...rest }: Props): JSX.Element {
    return (
        <section className={`${className ?? ""} container`} {...rest}>
            {children}
        </section>
    );
}
