import express, { Application, Request, Response } from 'express';
import connectDataBase from './database/db.config.js';
import 'dotenv/config';

const app: Application = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, world!');
});

let PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    await connectDataBase();
    console.log(`Server is running on http://localhost:${PORT}`);
});
