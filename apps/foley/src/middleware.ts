import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function handler(req: NextRequest, _ev: NextFetchEvent) {
	if (req.nextUrl.pathname.startsWith('/smol/')) {
		const slug = req.nextUrl.pathname.split('/').pop();

		if (!slug || slug.length <= 0) return NextResponse.next();

		const reqUrl = req.nextUrl.origin + req.nextUrl.pathname;
		const res = await fetch(`${req.nextUrl.origin}/api/smol/${slug}`);
		const { data } = await res.json();

		if (data?.url && reqUrl === data.url) {
			console.warn('we have a sneaky bastard on the loose');
			return NextResponse.redirect('https://kipri.dev');
		}

		if (data.url) {
			return NextResponse.redirect(data.url);
		}

		return NextResponse.next();
	}

	return NextResponse.next();
}
