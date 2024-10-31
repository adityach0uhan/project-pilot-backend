import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import connectDataBase from './database/db.config.js';
import authRouter from './routes/auth.router.js';
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
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, world!');
});

app.use('/auth', authRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    try {
        await connectDataBase();
        console.log(`Server is running on http://localhost:${PORT}`);
    } catch (error) {
        console.error('Database connection failed:', error);
    }
});
