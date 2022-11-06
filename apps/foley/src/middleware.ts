import { Smol } from '@clfxc/db';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

const ratelimit = new Ratelimit({
	redis: Redis.fromEnv(),
	limiter: Ratelimit.fixedWindow(200, '5 s'),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function handler(req: NextRequest, ev: NextFetchEvent) {
	// all api endpoints
	if (req.nextUrl.pathname.startsWith('/api/')) {
		const ip = req.ip ?? '127.0.0.1';

		const { success, pending, limit, remaining, reset } = await ratelimit.limit(`mw_${ip}`);
		ev.waitUntil(pending);

		if (!success) {
			const res = NextResponse.json({ message: 'chill' });
			res.headers.set('X-RateLimit-Limit', limit.toString());
			res.headers.set('X-RateLimit-Remaining', remaining.toString());
			res.headers.set('X-RateLimit-Reset', reset.toString());
			return res;
		}
	}

	// smol pages
	if (req.nextUrl.pathname.startsWith('/smol/')) {
		const origin = req.nextUrl.origin;
		const pathname = req.nextUrl.pathname;
		const slug = pathname.split('/').pop();
		const res = await fetch(`${origin}/api/smol/${slug}`);
		const resOk = res.ok;
		const { data } = await res.json();
		const smol = data as Smol;

		if (!resOk || !smol) {
			console.warn('slug not found');
			return NextResponse.redirect(`${origin}/smol`);
		}

		if (`${origin.toLowerCase()}${pathname}`.localeCompare(data.url.toLowerCase()) === 0) {
			console.warn('we have a sneaky bastard on the loose');
			// TODO: add request to remove entry
			return NextResponse.json({ message: 'chill' });
		}

		if (data.url) {
			return NextResponse.redirect(data.url);
		}
	}

	return NextResponse.next();
}
