import express from 'express';
import { getRouters } from './routers/index.js';

const app = express();

app.use(express.json());
app.use(getRouters());

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`app listenting on: http://localhost:${port}`);
});
