import { type VoidComponent } from "solid-js";
import { HttpStatusCode } from "solid-start/server/components/HttpStatusCode";

const NotFound: VoidComponent = () => {
    return (
        <>
            <HttpStatusCode code={404} />
            <main>
                <h1>something went wrong</h1>
            </main>
        </>
    );
};

export default NotFound;
