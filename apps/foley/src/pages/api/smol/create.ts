import { prisma, type Smol } from "@clfxc/db";
import { type AsyncReturnType } from "@clfxc/services/utils";
import { URLS } from "@declarations/enums";
import { UrlSchema } from "@declarations/schemas";
import { fetchCreateSmol, makeLetterMix, validateSessionApiRequest } from "@utils/helpers";
import { protocol, siteHost } from "@utils/misc";
import { type NextApiRequest, type NextApiResponse } from "next/types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const url = UrlSchema.safeParse(req.body?.url);

    if (!url.success) {
        res.status(400).json({ message: "invalid body sent" });
        return;
    }

    const session = await validateSessionApiRequest(req.headers);
    if (!session) {
        return res.status(401).send("invalid session");
    }

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
        console.warn(`user: ${session.userId} session token: ${session.sessionToken}`);
        return;
    }

    const smol: Omit<Smol, "id"> = {
        userId: session.userId,
        status: "active",
        slug,
        url: url.data,
        accessed: 0,
        updatedAt: new Date(),
        createdAt: new Date(),
    };

    await prisma.smol.create({ data: smol });

    const smolLink = `${protocol + siteHost}${URLS.SMOL}/${slug}`;
    const short = `${siteHost}${URLS.SMOL}/${slug}`;

    console.log(`created shortened link for user: ${session.userId} with slug: ${slug}`);

    return res.status(200).json({ smol: smolLink, short } satisfies AsyncReturnType<typeof fetchCreateSmol>);
};

// Next api config
export const config = {
    api: {
        bodyParser: {
            sizeLimit: "3500kb",
        },
    },
};
