export enum StateStatus {
	idle = 'idle',
	loading = 'loading',
	failed = 'failed',
}

// URLS
export enum URLS {
	// WEBSITE
	HOME = '/',
	REPLACE = '/replace',
	SMOL = '/smol',
	QR = '/qrc',
	CLOSET = '/closet',

	// API
	API_SMOL = '/api/smol',
	API_SMOL_CREATE = '/api/smol/create',
	API_QR_CREATE = '/api/qr/create',
}

export enum Langs {
	en = 'en',
	ro = 'ro',
}

export enum Currency {
	RON = 'RON',
	EUR = 'EUR',
	USD = 'USD',
}

export enum PaymentProvider {
	STRIPE = 'stripe',
	PAYPAL = 'paypal',
}

export enum AccountType {
	admin = 'admin',
	standard = 'standard',
	member = 'member',
	premium = 'premium',
}

export enum ImageType {
	png = 'image/png',
	jpeg = 'image/jpeg',
	jpg = 'image/jpg',
	svg = 'image/svg',
	gif = 'image/gif',
	webp = 'image/webp',
}

export enum FileType {
	pdf = 'application/pdf',
	ppt = 'application/vnd.ms-powerpoint',
	pptx = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	msword = 'application/msword',
	mswordx = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	text = 'text/plain',
	mp4 = 'video/mp4',
	mp3 = 'audio/mpeg',
	mpeg = 'video/mpeg',
	json = 'application/json',
	webm = 'video/webm',
}

// HEAD
export enum TITLE {
	HOME = 'Home xD',
}

export enum DESCRIPTION {
	HOME = 'Description xD',
}

export enum OG_DESCRIPTION {
	HOME = 'Description xD',
}

export enum OG_TITLE {
	HOME = 'Home xD',
}

export enum KEYWORDS {
	HOME = 'home xd',
}
