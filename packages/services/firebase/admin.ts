import { credential, initializeApp } from 'firebase-admin';
// import { getFirestore } from 'firebase-admin/firestore';
// import { getAuth } from 'firebase/auth';
import type { InitFirebaseServerSideParams } from '../utils/declarations';

export const initAdminFireApp = ({
	credential: { projectId, privateKey, clientEmail },
	firebaseConfig,
}: InitFirebaseServerSideParams) => {
	initializeApp({
		...firebaseConfig,
		serviceAccountId: clientEmail,
		credential: credential.cert({
			projectId,
			privateKey,
			clientEmail,
		}),
	});
};

// firebase server refs
// const firestore = getFirestore();
// const auth = getAuth();
