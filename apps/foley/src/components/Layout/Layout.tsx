// import Navbar from '@components/Navbar/Navbar';
import { FC, PropsWithChildren } from "react";
// import Footer from './Footer/Footer';

// interface Props {}

const Layout: FC<PropsWithChildren> = ({ children }) => {
    return (
        <>
            {/* <Navbar /> */}
            {children}
            {/* <Footer /> */}
        </>
    );
};

export default Layout;
