import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import connectDataBase from './database/db.config.js';
import 'dotenv/config';

const app: Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const corsOptions = {
    origin: function (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void
    ) {
        const allowedOrigins = ['http://localhost:3000', 'http://example2.com'];
        if (allowedOrigins.indexOf(origin || '') !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, world!');
});

let PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    await connectDataBase();
    console.log(`Server is running on http://localhost:${PORT}`);
});
