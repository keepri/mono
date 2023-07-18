import { type JSXElement, type VoidComponent } from "solid-js";

const Navbar: VoidComponent = (): JSXElement => {
    return (
        <nav class="grid place-items-center min-h-[10vh]">
            <div class="container flex justify-between px-6 py-4">
                <h1 class="font-hatton-semibold text-4xl font-extrabold cursor-pointer">nika.</h1>
                <ul class="flex justify-evenly items-center"> </ul>
            </div>
        </nav>
    );
};

export default Navbar;
