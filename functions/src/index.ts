import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import storiesRouter from './routes/storiesRouter';

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", storiesRouter);

export const api = functions.https.onRequest(app);