import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function handler(req: NextRequest, _ev: NextFetchEvent) {
	if (req.nextUrl.pathname.startsWith('/smol/')) {
		const slug = req.nextUrl.pathname.split('/').pop();

		if (!slug || slug.length <= 0) return NextResponse.next();

		await fetch(`${req.nextUrl.origin}/api/smol/${slug}`);
		return NextResponse.next();
	}

	return NextResponse.next();
}
