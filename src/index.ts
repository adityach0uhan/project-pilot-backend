import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import connectDataBase from './database/db.config.js';
import authRouter from './routes/auth.router.js';
import projectRouter from './routes/project.router.js';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import groupRouter from './routes/group.router.js';
import verifyToken from './routes/token.verification.js';

const app: Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ['http://localhost:3000'];
app.use(
    cors({
        origin: allowedOrigins,
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    })
);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'Error' && err.message.includes('CORS')) {
        res.status(403).json({ message: 'CORS Error: Access Denied' });
    } else {
        console.error(err);
        res.status(err.status || 500).json({
            message: err.message || 'Internal Server Error'
        });
    }
});

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, world!');
});

app.use('/auth', authRouter);
app.use('/projects', projectRouter);
app.use('/group', groupRouter);
app.use('/token', verifyToken);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    try {
        await connectDataBase();
        console.log(`Server is running on http://localhost:${PORT}`);
    } catch (error) {
        console.error('Database connection failed:', error);
    }
});
