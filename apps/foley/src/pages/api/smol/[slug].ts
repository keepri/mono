import { getSmolBySlug, validateSession } from "@utils/helpers";
import type { NextApiRequest, NextApiResponse } from "next/types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const slug = req.query["slug"];
    if (typeof slug !== "string") {
        return res.status(400).json({ message: "slug not valid" });
    }

    const session = await validateSession(req.headers);
    if (!session) {
        return res.status(401).json({ message: "could not validate session" });
    }

    const smolRes = await getSmolBySlug(slug);
    if ("message" in smolRes) {
        return res.status(smolRes.status).json({ message: smolRes.message });
    }

    return res.status(200).json(smolRes.smol);
};
