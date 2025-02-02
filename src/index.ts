import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import connectDataBase from './database/db.config.js';
import authRouter from './routes/auth.router.js';
import projectRouter from './routes/project.router.js';
import groupRouter from './routes/group.router.js';
import superAdminRouter from './routes/superadmin.router.js';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import collegeRouter from './routes/college.router.js';
import notificationRouter from './routes/notification.router.js';

const app: Application = express();

// const allowedOrigins = [
//     'http://localhost:3000',
//     'https://projectpilot.vercel.app'
// ];

const corsOptions = {
    origin: 'https://projectpilot.vercel.app',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Project Pilot API is running 🚀' });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/college', collegeRouter);
app.use('/api/v1/superadmin/', superAdminRouter);
app.use('/api/v1/:collegeId/projects', projectRouter);
app.use('/api/v1/:collegeId/group', groupRouter);
app.use('/api/v1/:collegeId/notification', notificationRouter);

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
        console.log(`✅ Server is live on http://localhost:${PORT}`);
    } catch (error: any) {
        console.log('❌ Database connection failed:', error);
    }
});
