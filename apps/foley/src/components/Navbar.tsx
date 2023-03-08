import { Link } from "@clfxc/ui/components/Link";
import { londrinaSketch } from "@utils/misc";
import { type HTMLAttributes } from "react";
import Auth from "./Auth";

type Props = HTMLAttributes<HTMLElement>;

export default function Navbar({ className, ...rest }: Props): JSX.Element {
    return (
        <nav
            className={`${className ? className : ""} container min-h-[4rem] flex flex-wrap items-center justify-between gap-4 py-2 px-4 bg-[var(--clr-bg-500)]`}
            {...rest}
        >
            <Logo />
            <Auth />
        </nav>
    );
}

function Logo(): JSX.Element {
    return (
        <Link href="/">
            <h1 className={`hover:text-[var(--clr-orange)] text-white text-6xl ${londrinaSketch.variable} font-londrina-sketch`}>
                K
            </h1>
        </Link>
    );
}
