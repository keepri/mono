import { toFile } from "qr";
import { validateSession$ } from "@utils/helpers";
import { readFileSync } from "fs";
import { type NextApiRequest, type NextApiResponse } from "next/types";
import { z } from "zod";
import { generateErrorMessage } from "zod-error";

const fileName = "i_gib";
const defaultMargin: number = 2;

const BodySchema = z.object({
    data: z.string().trim(),
    options: z.object({
        margin: z.number().nonnegative().default(defaultMargin),
        width: z.number().nonnegative().default(200),
        color: z.object({
            light: z.string().startsWith("#").default("#ffffff"),
            dark: z.string().startsWith("#").default("#000000"),
        }),
    }),
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        return res.status(405).send("unsupported method");
    }

    try {
        const bodyParse = BodySchema.safeParse(req.body);

        if (!bodyParse.success) {
            return res.status(400).send(generateErrorMessage(bodyParse.error.issues));
        }

        const session = await validateSession$(req.headers);

        if (!session) {
            console.warn("could not validate session for headers:", req.headers);
            return res.status(401).send("could not validate session");
        }

        console.log(`user ${session.userId} has created a svg`);

        const { data, options } = bodyParse.data;
        const encoder = new TextEncoder();
        const dataEncoded = encoder.encode(data);
        const bytes = dataEncoded.BYTES_PER_ELEMENT * dataEncoded.byteLength;

        if (bytes >= 2953) {
            console.warn("data too big:", bytes, "bytes sent. user:", session.userId);
            return res.status(401).send("too big");
        }

        const filePath = `/tmp/${fileName}_${Date.now()}.svg`;
        await toFile(filePath, data, options);
        const url = readFileSync(filePath, { encoding: "base64" });

        console.log(`created qr code for user: ${session.userId}`);

        return res.status(200).send("data:image/svg+xml;base64," + url);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch ({ stack, message }: any) {
        console.error("create qr endpoint fail stack:", stack);
        console.error("create qr endpoint fail message:", message);

        return res.status(500).send(message);
    }
};
