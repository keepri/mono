import { useCallback, useState, type HTMLAttributes } from "react";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { GitHub } from "@clfxc/ui";
import LoadingBounce from "@components/Loading/LoadingBounce";
import { AuthProvider } from "@declarations/enums";

export const DEFAULT_AUTH_PROVIDER: AuthProvider = AuthProvider.GITHUB;

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

    const onSignOut = useCallback(async () => {
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
                <span className={!isAuthenticated && !loading ? "hidden" : "flex flex-wrap items-center justify-end gap-2"}>
                    <LoadingBounce enabled={loading} className="justify-end">
                        <p className="max-w-[35ch] text-white text-center font-medium whitespace-nowrap overflow-x-hidden text-ellipsis">
                            hi, {session.data?.user?.name ?? "u"}
                        </p>
                    </LoadingBounce>
                    {session.data?.user?.image ?
                        <Image
                            src={session.data.user.image}
                            width={27}
                            height={27}
                            className="rounded-full object-center object-cover"
                            alt="user image"
                        /> :
                        <i> ✌️ </i>}
                </span>
                <span className="group flex items-center justify-end gap-2">
                    <div className={`${isAuthenticated || loading ? "hidden" : ""} flex gap-2 items-center justify-evenly group-hover:scale-100 scale-0 group-hover:opacity-100 opacity-0 transition-transform`}>
                        <GitHub onClick={() => onSignIn(AuthProvider.GITHUB)} />
                    </div>
                    <button
                        disabled={loading || loadingSession}
                        onClick={() => isAuthenticated ? onSignOut() : onSignIn(DEFAULT_AUTH_PROVIDER)}
                        className={`${isAuthenticated || loading ? "text-xs" : "font-medium"} text-lg group-hover:text-[var(--clr-orange)] text-white transition-colors duration-100`}
                    >
                        {loading ? "on it" : isAuthenticated ? "sign out" : "sign in"}
                    </button>
                </span>
            </span>
        </>
    );
}
