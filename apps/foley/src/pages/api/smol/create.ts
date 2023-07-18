import { Smol, prisma } from "db";
import { SmolSchema } from "db/schemas";
import { makeLetterMix } from "utils";
import { URLS } from "@utils/enums";
import { validateSessionApiRequest } from "@utils/helpers";
import { protocol, siteHost } from "@utils/misc";
import { type NextApiRequest, type NextApiResponse } from "next/types";
import { generateErrorMessage } from "zod-error";

export const BodySchema = SmolSchema.pick({ url: true });

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        return res.status(405).send("unsupported method");
    }

    try {
        const body = BodySchema.safeParse(req.body);

        if (!body.success) {
            return res.status(400).send(generateErrorMessage(body.error.issues));
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
            } satisfies Omit<Smol, "id">
        });

        console.log(`created shortened link for user: ${session.userId} with slug: ${slug}`);

        return res.status(200).send(`${protocol}${siteHost}${URLS.SMOL}/${slug}` satisfies Smol["url"]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch ({ stack, message }: any) {
        console.error("create short link fail stack:", stack);
        console.error("create short link fail message:", message);

        return res.status(500).send(message);
    }
};

// Next api config
export const config = {
    api: {
        bodyParser: {
            sizeLimit: "3500kb",
        },
    },
};
