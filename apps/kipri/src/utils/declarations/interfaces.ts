// eslint-disable-next-line import/no-unresolved
import { ServiceAccount } from 'firebase-admin/app';
import { FirebaseOptions } from 'firebase/app';

export interface InitFirebaseServerSideParams {
	firebaseConfig: FirebaseOptions;
	credential: ServiceAccount;
}

export interface InitFirebaseClientSideParams {
	firebaseConfig: FirebaseOptions;
}
