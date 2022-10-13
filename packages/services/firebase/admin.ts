// eslint-disable-next-line import/no-unresolved
import { cert, initializeApp } from 'firebase-admin/app';
// eslint-disable-next-line import/no-unresolved
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase/auth';
import { InitFirebaseServerSideParams } from '../utils/declarations/types';

export const initAdminFireApp = ({
	credential: { projectId, privateKey, clientEmail },
	firebaseConfig,
}: InitFirebaseServerSideParams) => {
	initializeApp({
		...firebaseConfig,
		serviceAccountId: clientEmail,
		credential: cert({
			projectId,
			privateKey,
			clientEmail,
		}),
	});
};

// firebase server refs
const firestore = getFirestore();
const auth = getAuth();
