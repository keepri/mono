import { create, QRCode, toDataURL } from 'qrcode';

export type { QRCode } from 'qrcode';
export { toDataURL };

export async function makeQRCodeClient(
	data: string
): Promise<{ ok: false; error?: unknown; code?: undefined } | { ok: true; error?: unknown; code: QRCode }> {
	if (typeof window === 'undefined') throw new Error("can't build code on the server");
	if (!data) return { ok: false, error: { message: 'no data' } };

	const encoder = new TextEncoder();
	const dataEncoded = encoder.encode(data);
	const bytes = dataEncoded.BYTES_PER_ELEMENT * dataEncoded.byteLength;
	// WARN: hardcoded urls
	const origin = process.env.NODE_ENV === 'production' ? 'https://kipri.dev' : 'http://localhost:3001';
	const createSmolUrl = origin + '/api/smol/create';

	if (bytes > 2953) {
		console.log('bytes?', bytes);
		console.warn('qr code data too big -> making smol');

		const smolRes = await fetch(createSmolUrl, {
			method: 'POST',
			body: JSON.stringify({ url: data }),
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		});

		if (!smolRes.ok) {
			return { ok: false, error: { message: 'could not create shortened link' } };
		}

		const { smol } = await smolRes.json();

		data = smol;
	}

	const code = create(data);

	return { code, ok: true };
}
