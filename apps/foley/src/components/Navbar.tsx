import { Link } from "@clfxc/ui/components/Link";
import { londrinaSketch } from "@utils/misc";
import { type HTMLAttributes } from "react";
import Auth from "./Auth";

type Props = HTMLAttributes<HTMLElement>;

export default function Navbar({ className, ...rest }: Props): JSX.Element {
    return (
        <nav
            className={`${className ? className : ""} container sticky top-0 flex flex-wrap items-center max-sm:justify-around justify-between gap-4 py-4 px-6 bg-[var(--clr-bg-500)]`}
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
            <h1 className={`hover:text-[var(--clr-orange)] text-white text-6xl leading-none ${londrinaSketch.variable} font-londrina-sketch`}>
                K
            </h1>
        </Link>
    );
}
