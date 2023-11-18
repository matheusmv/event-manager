import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import cors from 'cors';
import { getRouters } from './routers/index.js';
import { globalErrorHandler } from './middlewares/errors.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(getRouters());
app.use(globalErrorHandler());

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`app listenting on: http://localhost:${port}`);
});
