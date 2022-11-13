import { create, QRCode, toDataURL, toFile } from 'qrcode';

export type { QRCode } from 'qrcode';
export { toDataURL, toFile };

export async function makeQRCode(
	data: string
): Promise<{ ok: false; error?: unknown; code?: undefined } | { ok: true; error?: unknown; code: QRCode }> {
	if (!data) return { ok: false, error: { message: 'no data' } };

	const encoder = new TextEncoder();
	const dataEncoded = encoder.encode(data);
	const bytes = dataEncoded.BYTES_PER_ELEMENT * dataEncoded.byteLength;
	// WARN: hardcoded urls
	const origin = process.env.NODE_ENV === 'production' ? 'https://kipri.dev' : 'http://localhost:3001';
	// const createQRUrl = origin + '/api/qr/create';
	const createSmolUrl = origin + '/api/smol/create';
	const headers = new Headers();

	headers.set('Content-Type', 'application/json');

	if (bytes > 2953) {
		console.log('bytes?', bytes);
		console.warn('qr code data too big -> making smol');

		const smolRes = await fetch(createSmolUrl, {
			method: 'POST',
			body: JSON.stringify({ url: data }),
			headers,
		});

		if (!smolRes.ok) {
			return { ok: false, error: { message: 'could not create shortened link' } };
		}

		const { smol } = await smolRes.json();

		data = smol;
	}

	const code = create(data);
	// const qrRes = await fetch(createQRUrl, {
	// 	method: 'POST',
	// 	body: JSON.stringify({ data }),
	// 	headers,
	// });

	// if (!qrRes.ok) {
	// 	return { ok: false, error: { message: 'could not create qr code' } };
	// }

	// const { code } = await qrRes.json();

	return { code, ok: true };
}
