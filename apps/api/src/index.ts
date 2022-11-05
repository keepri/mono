import { t } from '@clfxc/services';
import express from 'express';
import * as functions from 'firebase-functions';

const app = express();

app.get('*', (_req, res) => {
	res.send({
		hello: 'world',
		iLikeTurtles: t,
		nice: 69,
	});
});

export const server = functions.https.onRequest(app);
