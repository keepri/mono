import { prisma, Smol } from "@clfxc/db";
import { type AsyncReturnType } from "@clfxc/services/utils";
import { URLS } from "@declarations/enums";
import { UrlSchema } from "@declarations/schemas";
import { createSmol } from "@utils/helpers";
import { protocol, siteHost } from "@utils/misc";
import { type NextApiRequest, type NextApiResponse } from "next/types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const urlParse = UrlSchema.safeParse(req.body["url"]);

    if (!urlParse.success) {
        res.status(400).json({ message: "invalid body sent" });
        return;
    }

    const url = urlParse.data;
    let slug: string;
    let exists: boolean = false;

    do {
        slug = makeLetterMix(4);
        const found = await prisma.smol.findFirst({
            where: { slug: { equals: slug } },
            select: { status: true, url: true },
        });
        if (found) exists = true;
    } while (exists);

    if (typeof slug !== "string") {
        console.warn("something went wrong when generating new slug");
        return;
    }

    const smol: Pick<Smol, "url" | "status" | "slug"> = {
        url,
        status: "active",
        slug,
    };

    await prisma.smol.create({ data: smol });

    const smolLink = `${protocol + siteHost}${URLS.SMOL}/${slug}`;
    const short = `${siteHost}${URLS.SMOL}/${slug}`;

    res.status(200).json({ smol: smolLink, short } satisfies AsyncReturnType<typeof createSmol>);
    return;
};

function getRandom(upTo?: number) {
    const random = Math.floor(Math.random() * (upTo ?? 10));
    return random;
}

const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" as const;
function makeLetterMix(len: number) {
    let mix: string = "";
    for (let i = 0; i < len; i++) {
        const letter = letters[getRandom(letters.length - 1)];
        mix += letter;
    }
    return mix;
}

// Next api config
export const config = {
    api: {
        bodyParser: {
            sizeLimit: "3500kb",
        },
    },
};
