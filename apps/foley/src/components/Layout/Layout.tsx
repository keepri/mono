import Navbar from "@components/Navbar";
import { PropsWithChildren } from "react";
import Footer from "./Footer";
import { fontInconsolata } from "@utils/font";

type Props = PropsWithChildren;

export default function Layout({ children }: Props): JSX.Element {
    return (
        <>
            <Navbar />
            <main className={fontInconsolata}>
                {children}
                <Footer />
            </main>
        </>
    );
}
