// import { Button } from "@clfxc/ui";
import { Link } from "@clfxc/ui/components/Link";
import { inconsolata, londrinaSketch } from "@utils/misc";
import { FC, HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLElement>;
const Navbar: FC<Props> = ({ className, ...rest }) => {
    return (
        <nav className={`container min-h-[4rem] flex justify-between gap-4 px-4 py-5 bg-[var(--clr-bg-500)] ${inconsolata.variable} font-inconsolata ${className ? className : ""}`} {...rest}>
            <Link plain href="/" className="px-4">
                <h1 className={`${londrinaSketch.variable} font-londrina-sketch hover:text-[var(--clr-orange)] text-white text-6xl`}>K</h1>
            </Link>
            {
                // <Button varient="sign-in" /> 
            }
        </nav>
    );
};

export default Navbar;
