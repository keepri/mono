export type { QRCode } from 'qrcode';

import { QRCode } from 'qrcode';

export async function makeQRCode(
	data: string
): Promise<{ ok: false; error?: unknown; code?: undefined } | { ok: true; error?: unknown; code: QRCode }> {
	if (!data) return { ok: false };

	const headers = new Headers();
	headers.set('Content-Type', 'application/json');

	// WARN: hardcoded urls
	const origin = process.env.NODE_ENV === 'production' ? 'https://kipri.dev' : 'http://localhost:3001';
	const createQRUrl = origin + '/api/qr/create';
	const createSmolUrl = origin + '/api/smol/create';

	const smolRes = await fetch(createSmolUrl, {
		method: 'POST',
		body: JSON.stringify({ url: data }),
		headers,
	});

	if (!smolRes.ok) {
		return { ok: false, error: { message: 'could not create shortened link' } };
	}

	const { smol } = await smolRes.json();

	const qrRes = await fetch(createQRUrl, {
		method: 'POST',
		body: JSON.stringify({ data: smol }),
		headers,
	});

	if (!qrRes.ok) {
		return { ok: false, error: { message: 'could not create qr code' } };
	}

	const { code } = await qrRes.json();

	return { code, ok: true };
}
