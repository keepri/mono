import { https } from 'firebase-functions';
import { getApp } from 'firebase/app';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = https.onRequest((_request, response) => {
	// logger.info('Hello logs!', { structuredData: true });
	response.send('Hello from Firebase!');
});

// Connect functions to emulator for dev
const funcs = getFunctions(getApp());
connectFunctionsEmulator(funcs, 'localhost', 5001);
