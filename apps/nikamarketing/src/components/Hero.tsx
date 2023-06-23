import { type JSXElement, type ParentComponent } from "solid-js";
import Navbar from "./Navbar";

type Props = {
    children: JSXElement;
    class?: string;
};

const Hero: ParentComponent<Props> = (props): JSXElement => {
    return (
        <>
            <Navbar />
            <main class={`min-h-[90vh] ${props.class ?? ""}`}>{props.children}</main>
        </>
    );
};

export default Hero;
