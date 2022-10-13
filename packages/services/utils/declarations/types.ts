// eslint-disable-next-line import/no-unresolved
import { ServiceAccount } from 'firebase-admin/app';
import { FirebaseOptions } from 'firebase/app';

export type InitFirebaseServerSideParams = {
	firebaseConfig: FirebaseOptions;
	credential: ServiceAccount;
};

export type InitFirebaseClientSideParams = {
	firebaseConfig: FirebaseOptions;
};
