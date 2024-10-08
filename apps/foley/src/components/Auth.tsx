import { GitHub } from "ui";
import Bounce from "@components/Animations/Bounce";
import { AuthProvider } from "@utils/enums";
import { fontInconsolata } from "@utils/font";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useCallback, useState, type HTMLAttributes } from "react";

export const DEFAULT_AUTH_PROVIDER: AuthProvider = AuthProvider.github;

export default function Auth(props: HTMLAttributes<HTMLSpanElement>): JSX.Element {
    const session = useSession();
    const isAuthenticated = session.status === "authenticated";
    const loadingSession = session.status === "loading";

    const [loading, setLoading] = useState<boolean>(false);

    const onSignIn = useCallback(async (provider: AuthProvider) => {
        try {
            setLoading(true);
            await signIn(provider);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch ({ message }: any) {
            setLoading(false);
            console.error("can't sign in", message);
        }
    }, []);

    const onSignOut = useCallback(async function () {
        try {
            setLoading(true);
            await signOut();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch ({ message }: any) {
            setLoading(false);
            console.error("can't sign out", message);
        }
    }, []);

    return (
        <>
            <span className={`${props.className ?? ""} flex flex-col ${isAuthenticated ? "gap-[.27rem]" : "gap-1"}`}>
                <span
                    className={
                        !isAuthenticated && !loading ? "hidden" : "flex flex-wrap items-center justify-end gap-2"
                    }
                >
                    <Bounce enabled={loading} className="justify-end">
                        <p
                            className={`max-w-[35ch] text-center dark:text-white whitespace-nowrap overflow-x-hidden text-ellipsis ${fontInconsolata}`}
                        >
                            hi, {session.data?.user?.name ?? "u"}
                        </p>
                    </Bounce>
                    {session.data?.user?.image ? (
                        <Image
                            src={session.data.user.image}
                            width={27}
                            height={27}
                            className="dark:text-white rounded-full object-center object-cover"
                            alt="user image"
                        />
                    ) : (
                        <i>✌️</i>
                    )}
                </span>
                <span className="group flex items-center justify-end gap-2">
                    <div
                        className={`${
                            isAuthenticated || loading ? "hidden" : ""
                        } flex gap-2 items-center justify-evenly group-hover:scale-100 scale-0 group-hover:opacity-100 opacity-0 transition-transform`}
                    >
                        <GitHub className="dark:fill-white" onClick={() => onSignIn(AuthProvider.github)} />
                    </div>
                    <button
                        disabled={loading || loadingSession}
                        onClick={() => (isAuthenticated ? onSignOut() : onSignIn(DEFAULT_AUTH_PROVIDER))}
                        className={`${
                            isAuthenticated || loading ? "text-xs" : ""
                        } ${fontInconsolata} dark:text-white group-hover:text-[var(--clr-orange)] transition-colors duration-100`}
                    >
                        {loading ? "on it" : isAuthenticated ? "sign out" : "sign in"}
                    </button>
                </span>
            </span>
        </>
    );
}
