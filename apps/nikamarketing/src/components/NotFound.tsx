import { type VoidComponent } from "solid-js";
import { HttpStatusCode } from "solid-start/server/components/HttpStatusCode";

const NotFound: VoidComponent = () => {
    return (
        <>
            <HttpStatusCode code={404} />
            <main>
                <h1>ow neooowww</h1>
            </main>
        </>
    );
};

export default NotFound;
