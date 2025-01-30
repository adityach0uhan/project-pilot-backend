import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    const token =
        req.cookies.project_pilot_token ||
        req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        res.status(403).json({ message: 'Token is required' });
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY!, (err: any, decoded: any) => {
        if (err) {
            res.status(403).json({ message: 'Invalid or expired token' });
            return;
        }

        const { collegeId } = req.params;
        if (decoded.collegeId !== collegeId) {
            res.status(403).json({ message: 'Access denied for this college' });
            return;
        }
        req.user = decoded;
        next();
    });
};

export default verifyToken;
