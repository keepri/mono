import { prisma, Smol } from '@clfxc/db';
import { URLS } from '@declarations/enums';
import { urlSchema } from '@declarations/schemas';
import { protocol, siteHost } from '@utils/misc';
import { NextApiRequest, NextApiResponse } from 'next/types';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const urlParse = urlSchema.safeParse(req.body['url']);

	if (!urlParse.success) {
		res.status(400).json({ message: 'invalid body sent' });
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

	if (typeof slug !== 'string') {
		console.warn('something went wrong when generating new slug');
		return;
	}

	const smol: Omit<Smol, 'id' | 'createdAt' | 'updatedAt'> = {
		url,
		status: 'active',
		slug,
	};

	await prisma.smol.create({ data: smol });

	const smolLink = `${protocol + siteHost}${URLS.SMOL}/${slug}`;
	const short = `${siteHost}${URLS.SMOL}/${slug}`;

	res.status(200).json({ smol: smolLink, short });
	return;
};

function getRandom(upTo?: number) {
	const random = Math.floor(Math.random() * (upTo ?? 10));
	return random;
}

const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' as const;
function makeLetterMix(len: number) {
	let mix: string = '';
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
			sizeLimit: '3500kb',
		},
	},
};
