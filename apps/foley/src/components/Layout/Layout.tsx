import Navbar from "@components/Navbar";
import { inconsolata } from "@utils/misc";
import { FC, PropsWithChildren } from "react";
import Footer from "./Footer";

const Layout: FC<PropsWithChildren> = ({ children }) => {
    return (
        <>
            <Navbar className={`sticky top-0 ${inconsolata.variable} font-inconsolata`} />
            <main className={`${inconsolata.variable} font-inconsolata sticky top-0`}>
                {children}
                <Footer />
            </main>
        </>
    );
};

export default Layout;
