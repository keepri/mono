import { makeQRCode } from '@clfxc/services/qr';
import { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		res.status(405).json({ message: 'Unsupported method' });
		return;
	}

	const dataParse = z.string().min(1).safeParse(req.body['data']);

	if (!dataParse.success) {
		res.status(400).json({ message: 'invalid body sent' });
		return;
	}

	const data = dataParse.data;
	const code = makeQRCode(data);

	res.status(200).json({ code });
	return;
};
