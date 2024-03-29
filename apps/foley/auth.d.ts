import {
    type Account as DefaultAccount,
    type Profile as DefaultProfile,
    type DefaultSession,
    type DefaultUser,
} from "next-auth/core/types";
import { JWT } from "next-auth/jwt";

declare module "next-auth/core/types" {
    interface Session {
        jwt?: JWT;
        user?: {
            id: number;
        } & DefaultSession["user"];
    }

    /**
     * The shape of the user object returned in the OAuth providers' `profile` callback,
     * or the second parameter of the `session` callback, when using a database.
     */
    interface User extends DefaultUser { }

    /**
     * Usually contains information about the provider being used
     * and also extends `TokenSet`, which is different tokens returned by OAuth Providers.
     */
    interface Account extends DefaultAccount { }

    /** The OAuth profile returned from your provider */
    interface Profile extends DefaultProfile { }
}
