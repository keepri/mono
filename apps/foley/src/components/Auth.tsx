import { useCallback, useState } from "react";
import { GitHub } from "@clfxc/ui";
import { LoadingBounce } from "@components/Loading/LoadingBounce";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { AuthProvider } from "@declarations/enums";

export const DEFAULT_AUTH_PROVIDER: AuthProvider = AuthProvider.GITHUB;

type AuthProps = { session: ReturnType<typeof useSession> };

export function Auth({ session }: AuthProps) {
    const isSignedIn = session.status === "authenticated";

    const [loading, setLoading] = useState<boolean>(false);

    const onSignIn = useCallback(async (provider: AuthProvider) => {
        try {
            setLoading(true);
            await signIn(provider);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("can't sign in", error);
        }
    }, []);

    const onSignOut = useCallback(async () => {
        try {
            setLoading(true);
            await signOut();
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("can't sign out", error);

        }
    }, []);

    return (
        <>
            <span className={`grid py-1 px-2 ${isSignedIn ? "gap-[.17rem]" : "gap-1"}`}>
                <LoadingBounce enabled={loading} className="justify-end">
                    <span className={!isSignedIn ? "hidden" : "flex items-end gap-2"}>
                        <p className="text-white font-medium">
                            {session.data?.user?.name ?? "it u"}
                        </p>
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
                </LoadingBounce>
                <span className="group flex items-center justify-end gap-2 overflow-y-hidden">
                    <div className={`flex gap-2 items-center justify-evenly group-hover:translate-y-0 -translate-y-full group-hover:opacity-100 opacity-0 transition-transform duration-[150ms] delay-75 ${isSignedIn || loading ? "hidden" : ""}`}>
                        <GitHub onClick={() => onSignIn(AuthProvider.GITHUB)} />
                    </div>
                    <button
                        disabled={loading}
                        onClick={() => isSignedIn ? onSignOut() : onSignIn(DEFAULT_AUTH_PROVIDER)}
                        className={`text-lg group-hover:text-[var(--clr-orange)] text-white transition-colors duration-100 ${isSignedIn || loading ? "text-xs" : "font-medium"}`}
                    >
                        {isSignedIn ? "sign out" : "sign in"}
                    </button>
                </span>
            </span>
        </>
    );
}
