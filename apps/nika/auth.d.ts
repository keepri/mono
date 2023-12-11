/* eslint-disable @typescript-eslint/consistent-type-definitions */
import {
    type DefaultSession,
    // type DefaultUser,
    // type Account as DefaultAccount,
    // type Profile as DefaultProfile,
} from "@auth/core/types";

declare module "@auth/core/types" {
    interface Session {
        user?: {
            id?: string | null;
        } & DefaultSession["user"];
    }

    /**
     * The shape of the user object returned in the OAuth providers' `profile` callback,
     * or the second parameter of the `session` callback, when using a database.
     */
    // interface User extends DefaultUser { }

    /**
     * Usually contains information about the provider being used
     * and also extends `TokenSet`, which is different tokens returned by OAuth Providers.
     */
    // interface Account extends DefaultAccount { }

    /** The OAuth profile returned from your provider */
    // interface Profile extends DefaultProfile { }
}
