import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { getRouters } from './routers/index.js';
import { globalErrorHandler } from './middlewares/errors.js';
import { config } from './env.js';

const app = express();

app.use(morgan(config.logger.morgan));
app.use(cors());
app.use(express.json());
app.use(getRouters());
app.use(globalErrorHandler());

app.listen(config.port, () => {
    console.log(`app listenting on: http://localhost:${config.port}`);
});
