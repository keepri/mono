import { prisma } from "db";
import { type NextApiRequest, type NextApiResponse } from "next";
import { generateErrorMessage } from "zod-error";
import { sendEmail } from "@utils/email";
import { serverEnv } from "@env/server.mjs";
import { ContactBodySchema } from "@utils/schemas";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        return res.status(405).send("unsupported method");
    }

    try {
        const body = ContactBodySchema.safeParse(req.body);

        if (!body.success) {
            return res.status(400).send(generateErrorMessage(body.error.issues));
        }

        const contact = await prisma.contact.create({ data: body.data, });

        console.log("successfully saved contact form", contact.id, "from", contact.email, "on", contact.createdAt);

        const user = body.data.userId?.length ?
            await prisma.user.findFirst({ where: { id: { equals: body.data.userId } } }) :
            null;

        await sendEmail({
            to: [{ name: "KIPRI.dev", email: serverEnv.CONTACT_EMAIL }],
            subject: "New contact form submission",
            textContent: `
                Name: ${body.data.name ?? "none"}
                Email: ${body.data.email}
                Message: ${body.data.message}
                
                ${user ? `User name & id: ${user.name ?? "missing name"} - ${user.id}` : "User not logged in"}
                Date: ${contact.createdAt.toLocaleString()}
                DatabaseId: ${contact.id}
            `,
        });

        return res.status(200).send("done");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch ({ stack, message }: any) {
        console.error("contact endpoint fail stack:", stack);
        console.error("contact endpoint fail message:", message);

        return res.status(500).send(message);
    }
};
