/* eslint-disable @typescript-eslint/ban-types */
import {
    type DefaultSession,
    type DefaultUser,
    type Account as DefaultAccount,
    type Profile as DefaultProfile,
} from "@auth/core/types";

declare module "@auth/core/types" {
    type Session = {
        user?: {
            id?: string;
        } & DefaultSession["user"];
    };

    /**
     * The shape of the user object returned in the OAuth providers' `profile` callback,
     * or the second parameter of the `session` callback, when using a database.
     */
    type User = {} & DefaultUser;

    /**
     * Usually contains information about the provider being used
     * and also extends `TokenSet`, which is different tokens returned by OAuth Providers.
     */
    type Account = {} & DefaultAccount;

    /** The OAuth profile returned from your provider */
    type Profile = {} & DefaultProfile;
}
