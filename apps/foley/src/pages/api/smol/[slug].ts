import prisma from '@env/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const slug = req.query['slug'];

	if (typeof slug !== 'string') {
		res.status(400).json({ message: 'slug not valid' });
		return;
	}

	const data = await prisma.smol.findFirst({ where: { slug: { equals: slug } } });

	if (!data) {
		res.status(404).json({ message: 'not found' });
		return;
	}

	if (!data?.url) {
		res.status(400).json({ message: 'found, but no url exists for redirect' });
		return;
	}

	if (data.status !== 'active') {
		res.status(401).json({ message: 'url note active anymore' });
	}

	res.status(200).json({ data });
	return;
};
