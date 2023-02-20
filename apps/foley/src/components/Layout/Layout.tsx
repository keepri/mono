// import Navbar from '@components/Navbar/Navbar';
import { inconsolata } from "@utils/misc";
import { FC, PropsWithChildren } from "react";
// import Footer from './Footer/Footer';

// interface Props {}

const Layout: FC<PropsWithChildren> = ({ children }) => {
    return (
        <>
            {/* <Navbar /> */}
            <main className={`${inconsolata.variable} font-inconsolata`}>
                {children}
            </main>
            {/* <Footer /> */}
        </>
    );
};

export default Layout;
