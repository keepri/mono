import { SolidAuth } from "@auth/solid-start";
import { authOpts } from "~/utils/auth";

export const { GET, POST } = SolidAuth(authOpts);
