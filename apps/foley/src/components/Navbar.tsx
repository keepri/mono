import { Link } from "@clfxc/ui/components/Link";
import { londrinaSketch } from "@utils/misc";
import { useSession } from "next-auth/react";
import { FC, HTMLAttributes } from "react";
import { Auth } from "./Auth";

type Props = HTMLAttributes<HTMLElement>;

const Navbar: FC<Props> = ({ className, ...rest }) => {
    const session = useSession();

    return (
        <nav
            className={`${className ? className : ""} container min-h-[4rem] flex items-center justify-between gap-4 py-2 px-4 bg-[var(--clr-bg-500)]`}
            {...rest}
        >
            <Logo />
            <Auth session={session} />
        </nav>
    );
};

function Logo() {
    return (
        <Link href="/">
            <h1 className={`hover:text-[var(--clr-orange)] text-white text-6xl ${londrinaSketch.variable} font-londrina-sketch`}>
                K
            </h1>
        </Link>
    );
}

export default Navbar;



