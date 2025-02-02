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

// ✅ Allowed Origins
const allowedOrigins = [
    'http://localhost:3000',
    'https://projectpilot.vercel.app'
];

// ✅ CORS Configuration (With Dynamic Origin Handling)
app.use((req, res, next) => {
    const origin = req.headers.origin as string;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader(
            'Access-Control-Allow-Methods',
            'GET,HEAD,PUT,PATCH,POST,DELETE'
        );
        res.setHeader(
            'Access-Control-Allow-Headers',
            'Content-Type, Authorization'
        );
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    next();
});

// ✅ Proper Preflight Handling
app.options('*', (req, res) => {
    res.status(200).json({ message: 'Preflight OK' });
});

// ✅ Middleware Order (IMPORTANT)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Project Pilot API is running 🚀' });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/college', collegeRouter);
app.use('/api/v1/superadmin/', superAdminRouter);
app.use('/api/v1/:collegeId/projects', projectRouter);
app.use('/api/v1/:collegeId/group', groupRouter);
app.use('/api/v1/:collegeId/notification', notificationRouter);

// ✅ Global Error Handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error'
    });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    try {
        await connectDataBase();
        console.log(`✅ Server is live on http://localhost:${PORT}`);
    } catch (error: any) {
        console.log('❌ Database connection failed:', error);
    }
});
