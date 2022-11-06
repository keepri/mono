import { Smol } from '@clfxc/db';
import prisma from '@env/prisma';
import { origin } from '@utils/misc';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const url = req.body['url'];

	if (typeof url !== 'string') {
		res.status(400).json({ message: 'invalid body sent' });
		return;
	}

	let slug: string;
	let exists: boolean = false;
	do {
		slug = makeLetterMix(4);
		const found = (await fetch(`${req.headers.origin}/api/smol/${slug}`)).ok;
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

	const short = `${origin}/smol/${slug}`.split('https://').pop();

	res.status(200).json({ smol: short });
	return;
};

const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function getRandom(upTo?: number) {
	const random = Math.floor(Math.random() * (upTo ?? 10));
	return random;
}

function makeLetterMix(len: number) {
	let mix: string = '';
	for (let i = 0; i < len; i++) {
		const letter = letters[getRandom(letters.length - 1)];
		mix += letter;
	}
	return mix;
}
