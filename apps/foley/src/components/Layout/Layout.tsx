import Navbar from "@components/Navbar";
import { inconsolata } from "@utils/misc";
import { type FC, PropsWithChildren } from "react";
import Footer from "./Footer";

type Props = PropsWithChildren;

const Layout: FC<Props> = ({ children }) => {
    return (
        <>
            <Navbar className={`sticky top-0 ${inconsolata.variable} font-inconsolata`} />
            <main className={`sticky top-0 ${inconsolata.variable} font-inconsolata`}>
                {children}
                <Footer />
            </main>
        </>
    );
};

export default Layout;
