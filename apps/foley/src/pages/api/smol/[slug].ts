import { prisma } from "@clfxc/db";
import type { NextApiRequest, NextApiResponse } from "next/types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const slug = req.query["slug"];

    if (typeof slug !== "string") {
        res.status(400).json({ message: "slug not valid" });
        return;
    }

    // eslint-disable-next-line max-len
    const data = await prisma.smol.findFirst({ where: { slug: { equals: slug } }, select: { status: true, url: true } });

    if (!data) {
        res.status(404).json({ message: "not found Sadge" });
        return;
    }

    if (!data.url) {
        console.log("no url found");
        res.status(400).json({ message: "found, but no url exists for redirect 4Head" });
        return;
    }

    if (data.status !== "active") {
        console.warn("inactive url hit");
        res.status(401).json({ message: "smol not active anymore AnyGifters" });
    }

    res.status(200).json({ data });
    return;
};
