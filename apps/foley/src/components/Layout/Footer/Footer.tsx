import { GitHub } from "@clfxc/ui";
import { Link } from "@clfxc/ui/components/Link";
import { inconsolata } from "@utils/misc";
import { FC } from "react";

const Footer: FC = () => {
    return (
        <footer className="flex justify-center items-center gap-4 p-4 bg-[var(--clr-bg-500)]">
            <Link plain href="https://github.com/keepri" className={`flex gap-1 items-center justify-evenly py-1 px-2 text-xs hover:!text-[var(--clr-orange)] !text-white ${inconsolata.variable} font-inconsolata`} target="_blank">
                <GitHub width="25px" height="25px" />
                github/keepri
            </Link>
        </footer>
    );
};

export default Footer;
