import { Langs } from '@declarations/enums';
import { CookieSerializeOptions } from '@declarations/types';
import { FirebaseOptions } from 'firebase/app';
// import * as Cors from 'cors';

export const isProduction = process.env.NODE_ENV === 'production';
export const baseUrl = isProduction
	? typeof location !== 'undefined'
		? location.hostname
		: undefined
	: 'http://localhost:3000';

export const defaultLanguage = Langs.en;

// URLS
export const URLS = {
	// WEBSITE
	HOME: '/',

	// API
};

// MISC
// TODO update to correct domain
export const domain = isProduction ? (typeof window !== 'undefined' ? location.host : undefined) : 'localhost';
export const siteName = 'KIPRI';
export const reEmail =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const rePhone = /^(\+4|)?(07[0-8]{1}[0-9]{1}|02[0-9]{2}|03[0-9]{2}){1}?(\s|\.|\-)?([0-9]{3}(\s|\.|\-|)){2}$/gim;

// FIREBASE
export const firebaseConfig: FirebaseOptions = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
	// measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? '',
};

// COOKIES
export const defaultCookieOptions: CookieSerializeOptions = {
	// TODO update to "isProduction"
	secure: false,
	httpOnly: true,
	sameSite: isProduction ? 'strict' : 'lax',
	path: '/',
	domain,
};

// CORS
// export const cors = Cors({
// 	methods: ['GET', 'HEAD'],
// });

// REDUX INIT STATES
// export const initAuthState: AuthState = {
// 	loading: false,
// 	isLogged: false,
// 	token: undefined,
// 	user: baseClient,
// };
