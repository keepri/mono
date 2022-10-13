import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export const initApp = ({ firebaseConfig }: { firebaseConfig: FirebaseOptions }) => {
	initializeApp(firebaseConfig);
};

// firebase client refs
const firestoreFE = getFirestore();
const authFE = getAuth();
const storage = getStorage();

export default { initApp };
