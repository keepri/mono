import { getSmolBySlug } from "@utils/helpers";
import type { NextApiRequest, NextApiResponse } from "next/types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const slug = req.query["slug"];
    if (typeof slug !== "string") {
        return res.status(400).json({ message: "slug not valid" });
    }

    const smolRes = await getSmolBySlug(slug);
    if (smolRes.status !== 200) {
        return res.status(smolRes.status).json({ message: smolRes.message });
    }

    return res.status(200).json(smolRes.smol);
};
