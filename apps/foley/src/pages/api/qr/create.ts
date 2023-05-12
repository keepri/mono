import { toFile } from "@clfxc/qr";
import { validateSessionApiRequest } from "@utils/helpers";
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
    if (req.method !== "POST") return res.status(405).json({ message: "unsupported method" });
    const bodyParse = BodySchema.safeParse(req.body);

    if (!bodyParse.success) {
        const message = generateErrorMessage(bodyParse.error.issues);
        return res.status(401).json({ message });
    }

    const session = await validateSessionApiRequest(req.headers);
    if (!session) {
        console.warn("could not validate session for headers:", req.headers);
        return res.status(401).json({ message: "could not validate session" });
    }

    console.log(`user ${session.userId} has created a svg`);

    const { data, options } = bodyParse.data;
    const encoder = new TextEncoder();
    const dataEncoded = encoder.encode(data);
    const bytes = dataEncoded.BYTES_PER_ELEMENT * dataEncoded.byteLength;

    if (bytes >= 2953) {
        console.warn("data too big:", bytes, "bytes sent. user:", session.userId);
        return res.status(401).json({ message: "too big" });
    }

    const filePath = `/tmp/${fileName}_${Date.now()}.svg`;
    await toFile(filePath, data, options);
    const url = readFileSync(filePath, { encoding: "base64" });

    console.log(`created qr code for user: ${session.userId}`);

    return res.status(200).json({ message: "success", uri: "data:image/svg+xml;base64," + url });
};
