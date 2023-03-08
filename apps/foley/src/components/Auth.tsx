import { useCallback, useState } from "react";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { GitHub } from "@clfxc/ui";
import { LoadingBounce } from "@components/Loading/LoadingBounce";
import { AuthProvider } from "@declarations/enums";

export const DEFAULT_AUTH_PROVIDER: AuthProvider = AuthProvider.GITHUB;

export function Auth() {
    const session = useSession();
    const isSignedIn = session.status === "authenticated";

    const [loading, setLoading] = useState<boolean>(false);

    const onSignIn = useCallback(async (provider: AuthProvider) => {
        try {
            setLoading(true);
            await signIn(provider);
        } catch ({ message }) {
            setLoading(false);
            console.error("can't sign in", message);
        }
    }, []);

    const onSignOut = useCallback(async () => {
        try {
            setLoading(true);
            await signOut();
        } catch ({ message }) {
            setLoading(false);
            console.error("can't sign out", message);
        }
    }, []);

    return (
        <>
            <span className={`flex flex-col py-1 px-2 ${isSignedIn ? "gap-[.17rem]" : "gap-1"}`}>
                <span className={!isSignedIn && !loading ? "hidden" : "flex flex-wrap items-center justify-center gap-2"}>
                    <LoadingBounce enabled={loading}>
                        <p className="text-white text-center font-medium">
                            Hi, {session.data?.user?.name ?? "u"}
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
                <span className="group flex items-center justify-end gap-2 overflow-y-hidden">
                    <div className={`flex gap-2 items-center justify-evenly group-hover:translate-y-0 -translate-y-full group-hover:opacity-100 opacity-0 transition-transform duration-[150ms] delay-75 ${isSignedIn || loading ? "hidden" : ""}`}>
                        <GitHub onClick={() => onSignIn(AuthProvider.GITHUB)} />
                    </div>
                    <button
                        disabled={loading}
                        onClick={() => isSignedIn ? onSignOut() : onSignIn(DEFAULT_AUTH_PROVIDER)}
                        className={`${isSignedIn || loading ? "text-xs" : "font-medium"} text-lg group-hover:text-[var(--clr-orange)] text-white transition-colors duration-100`}
                    >
                        {isSignedIn ? "sign out" : "sign in"}
                    </button>
                </span>
            </span>
        </>
    );
}
