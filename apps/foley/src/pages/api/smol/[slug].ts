import { getSmolBySlug$ } from "@utils/helpers";
import type { NextApiRequest, NextApiResponse } from "next/types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") {
        return res.status(405).send("unsupported method");
    }

    try {
        const slug = req.query["slug"];

        if (typeof slug !== "string") {
            return res.status(400).send("invalid slug");
        }

        const smol = await getSmolBySlug$(slug);

        return res.status(200).json(smol);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch ({ stack, message }: any) {
        console.error(stack);
        console.error("getting smol by slug", message);
        const notFound = (message as string).startsWith("not found");
        return res.status(notFound ? 404 : 500).send(message);
    }
};
