import { URLS } from "@declarations/enums";
import Link from "next/link";
import { FC } from "react";

import styles from "./Navbar.module.scss";

// interface Props {}

const Navbar: FC = () => {
    return (
        <nav className="flex gap-4 px-4 py-5">
            <Link className={`button border-white ${styles.boop}`} href={URLS.REPLACE}>
				boop
            </Link>
            <Link className={`button border-white ${styles.boop}`} href={URLS.SMOL}>
				smol
            </Link>
        </nav>
    );
};

export default Navbar;
