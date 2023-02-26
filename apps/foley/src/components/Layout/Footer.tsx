import { GitHub } from "@clfxc/ui";
import { FC, HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLElement>;

const PERSONAL_GITHUB = "https://github.com/keepri" as const;

const Footer: FC<Props> = ({ className, ...rest }) => {
    return (
        <footer
            className={`${className ? className : ""} flex justify-center items-center gap-4 p-2 bg-[var(--clr-bg-500)]`}
            {...rest}
        >
            <a
                href={PERSONAL_GITHUB}
                className="flex gap-1 items-center justify-evenly py-1 px-2 text-xs hover:!text-[var(--clr-orange)] !text-white"
                target="_blank"
                rel="noreferrer"
            >
                <GitHub width="25px" height="25px" />
                github/keepri
            </a>
        </footer>
    );
};

export default Footer;
