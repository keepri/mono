import Navbar from "@components/Navbar";
import { inconsolata } from "@utils/misc";
import { PropsWithChildren } from "react";
import Footer from "./Footer";

type Props = PropsWithChildren;

export default function Layout({ children }: Props): JSX.Element {
    return (
        <>
            <Navbar className={`${inconsolata.variable} font-inconsolata`} />
            <main className={`sticky top-0 ${inconsolata.variable} font-inconsolata`}>
                {children}
                <Footer />
            </main>
        </>
    );
}
