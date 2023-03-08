import { readFileSync } from "fs";
import { toFile } from "@clfxc/services/qr";
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
    })
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") return res.status(405).json({ message: "unsupported method" });

    const bodyParse = BodySchema.safeParse(req.body);

    if (!bodyParse.success) {
        const message = generateErrorMessage(bodyParse.error.issues);
        return res.status(401).json({ message });
    }

    const { data, options } = bodyParse.data;
    const encoder = new TextEncoder();
    const dataEncoded = encoder.encode(data);
    const bytes = dataEncoded.BYTES_PER_ELEMENT * dataEncoded.byteLength;

    if (bytes >= 2953) {
        console.warn(bytes, "qr code data too big");
        res.status(401).json({ message: "too big" });
        return;
    }

    const filePath = `/tmp/${fileName}_${Date.now()}.svg`;
    await toFile(filePath, data, options);
    const url = readFileSync(filePath, { encoding: "base64" });
    res.status(200).json({ message: "success", uri: "data:image/svg+xml;base64," + url });
    return;
};
