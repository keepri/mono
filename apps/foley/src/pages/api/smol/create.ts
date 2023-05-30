import { Smol, prisma } from "@clfxc/db";
import { makeLetterMix } from "@clfxc/utils";
import { URLS } from "@utils/enums";
import { validateSessionApiRequest } from "@utils/helpers";
import { protocol, siteHost } from "@utils/misc";
import { UrlSchema } from "@utils/schemas";
import { type NextApiRequest, type NextApiResponse } from "next/types";
import { z } from "zod";

export const BodySchema = z.object({ url: UrlSchema });

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const body = BodySchema.safeParse(req.body);

    if (!body.success) {
        return res.status(400).send("invalid body");
    }

    const session = await validateSessionApiRequest(req.headers);

    if (!session) {
        return res.status(401).send("invalid session");
    }

    let slug: string;
    let exists: boolean = false;
    let retry: number = 3;

    do {
        slug = makeLetterMix(4);
        const found = await prisma.smol.findFirst({
            where: { slug: { equals: slug } },
            select: { id: true },
        });

        if (found && --retry) {
            exists = true;
        } else {
            exists = false;
        }
    } while (exists);

    if (typeof slug !== "string" || exists) {
        console.error("new slug has invalid type", typeof slug, slug);
        console.error(`user: ${session.userId} session token: ${session.sessionToken}`);
        return res.status(500).send("could not generate slug");
    }

    await prisma.smol.create({
        data: {
            userId: session.userId,
            status: "active",
            slug,
            url: body.data.url,
            accessed: 0,
            updatedAt: new Date(),
            createdAt: new Date(),
        }
    });

    console.log(`created shortened link for user: ${session.userId} with slug: ${slug}`);

    return res.status(200).send(`${protocol}${siteHost}${URLS.SMOL}/${slug}` satisfies Smol["url"]);
};

// Next api config
export const config = {
    api: {
        bodyParser: {
            sizeLimit: "3500kb",
        },
    },
};
