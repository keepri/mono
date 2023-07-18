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

        return res.status(200).json(await getSmolBySlug$(slug));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch ({ stack, message }: any) {
        console.error("get smol by slug endpoint fail stack:", stack);
        console.error("get smol by slug endpoint fail message:", message);

        return res.status((message as string).startsWith("not found") ? 404 : 500).send(message);
    }
};
