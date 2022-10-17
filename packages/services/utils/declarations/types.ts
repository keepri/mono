import { ServiceAccount } from 'firebase-admin/app';
import { FirebaseOptions } from 'firebase/app';

export type InitFirebaseServerSideParams = {
	firebaseConfig: FirebaseOptions;
	credential: ServiceAccount;
};

export type InitFirebaseClientSideParams = {
	firebaseConfig: FirebaseOptions;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (...args: any) => Promise<infer R>
	? R
	: unknown;
