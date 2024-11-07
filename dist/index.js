import express from 'express';
import cors from 'cors';
import connectDataBase from './database/db.config.js';
import authRouter from './routes/auth.router.js';
import projectRouter from './routes/project.router.js';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import groupRouter from './routes/group.router.js';
import verifyToken from './routes/token.verification.js';
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            process.env.FRONTEND_URL || 'http://localhost:3000' || '*'
        ];
        if (allowedOrigins.includes(origin || '')) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));
app.get('/', (req, res) => {
    res.send('Hello, world!');
});
app.use('/auth', authRouter);
app.use('/projects', projectRouter);
app.use('/group', groupRouter);
app.use('/token', verifyToken);
app.use((err, req, res, next) => {
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
    }
    catch (error) {
        console.error('Database connection failed:', error);
    }
});
