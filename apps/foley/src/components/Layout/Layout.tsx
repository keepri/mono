import Navbar from "@components/Navbar/Navbar";
import { inconsolata } from "@utils/misc";
// import { useRouter } from "next/router";
import { FC, PropsWithChildren } from "react";
import Footer from "./Footer/Footer";

// interface Props {}

const Layout: FC<PropsWithChildren> = ({ children }) => {
    return (
        <>
            <Navbar className="sticky top-0" />
            <main className={`${inconsolata.variable} font-inconsolata sticky top-0`}>
                {children}
                <Footer />
            </main>
        </>
    );
};

export default Layout;
