/* eslint-disable @typescript-eslint/no-var-requires */
const NextTranspileModules = require('next-transpile-modules');
const { join, relative } = require('path');
const { cwd, env } = require('process');

const withTM = NextTranspileModules(['ui']);

module.exports = withTM({
	experimental: { images: { allowFutureImage: true } },
	distDir: `${relative(cwd(), __dirname)}.next`,
	reactStrictMode: true,
	env: {
		FIREBASE_PROJECT_ID: env.FIREBASE_PROJECT_ID,
		FIREBASE_PRIVATE_KEY: env.FIREBASE_PRIVATE_KEY,
		FIREBASE_CLIENT_EMAIL: env.FIREBASE_CLIENT_EMAIL,
		TOKEN_SPLIT: env.TOKEN_SPLIT,
	},
	i18n: {
		locales: ['en'],
		defaultLocale: 'en',
	},
	images: {
		domains: ['firebasestorage.googleapis.com'],
	},
	sassOptions: {
		includePaths: [join(__dirname, 'src', 'styles')],
	},
	webpack(config) {
		config.resolve = {
			...config.resolve,
			fallback: {
				fs: false,
				path: false,
				os: false,
			},
		};

		return config;
	},
	redirects() {
		return [
			// {
			// 	source: '/',
			// 	destination: '/dashboard',
			// 	permanent: true,
			// },
		];
	},
});
