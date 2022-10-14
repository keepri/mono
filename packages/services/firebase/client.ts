import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';
import { InitFirebaseClientSideParams } from '../utils/declarations';

export const initClientFireApp = ({ firebaseConfig }: InitFirebaseClientSideParams) => {
	initializeApp(firebaseConfig);
};

// firebase client refs
// const firestoreFE = getFirestore();
// const authFE = getAuth();
// const storage = getStorage();
