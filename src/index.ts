import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import connectDataBase from './database/db.config.js';
import authRouter from './routes/auth.router.js';
import projectRouter from './routes/project.router.js';
import groupRouter from './routes/group.router.js';
import superAdminRouter from './routes/superadmin.router.js';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import verifyToken from './middlewares/verifyToken.js';
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
    res.json({ message: 'Student Project Manager API' });
});

app.use('/api/v1/auth', authRouter);
app.post('/api/v1/auth/logout', (req, res) => {
    res.clearCookie('project_pilot_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        domain: 'localhost',
        path: '/'
    });
    res.status(200).json({ message: 'Logged out successfully' });
});
app.use('/api/v1/superadmin/', superAdminRouter);
app.use('/api/v1/:collegeId/projects', verifyToken, projectRouter);
app.use('/api/v1/:collegeId/token', verifyToken, verifyToken);
app.use('/api/v1/:collegeId/group', verifyToken, groupRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    try {
        await connectDataBase();
        console.log(`Server is live on http://localhost:${PORT}`);
    } catch (error) {
        console.error('Database connection failed:', error);
    }
});
