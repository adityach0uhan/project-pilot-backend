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
import verifyToken from './middlewares/verifyToken.js';
import notificationRouter from './routes/notification.router.js';
const app: Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3000/',
    'https://projectpilot.vercel.app/'
];
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
    res.json({ message: 'Project Pilot API ' });
});

// combined auth routes for every user (student, teacher, college, superadmin)
app.use('/api/v1/auth', authRouter);

//Route for college admin dashboard
app.use('/api/v1/college', collegeRouter);

//Route for super admin dashboard
app.use('/api/v1/superadmin/', superAdminRouter);

//ALL Route related to  projects
app.use('/api/v1/:collegeId/projects', projectRouter);

//ALL Route related to  groups
app.use('/api/v1/:collegeId/group', groupRouter);

app.use('/api/v1/:collegeId/notification', notificationRouter);

// PORT and DB connection
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    try {
        await connectDataBase();
        console.log(`Server is live on http://localhost:${PORT}`);
    } catch (error: any) {
        console.log('Database connection failed:', error);
    }
});
