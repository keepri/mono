import { Link } from "@clfxc/ui/components/Link";
import { londrinaSketch } from "@utils/misc";
import { type HTMLAttributes } from "react";
import Auth from "./Auth";

type Props = HTMLAttributes<HTMLElement>;
// bg-gradient-to-br from-[var(--clr-bg-300)] to-[var(--clr-bg-500)]
export default function Navbar({ className, ...rest }: Props): JSX.Element {
    return (
        <nav
            className={`${className ? className : ""} sticky top-0 py-4 px-6 bg-[var(--clr-bg-500)]`}
            {...rest}
        >
            <div className="container flex flex-wrap items-center max-sm:justify-around justify-between gap-4">
                <Logo />
                <Auth />
            </div>
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
