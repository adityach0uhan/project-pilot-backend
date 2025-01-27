import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: string | JwtPayload;
        }
    }
}

export const checkLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const token: any = await req.cookies.student_project_manager_token;

    if (!token) {
        res.status(401).json({
            message: 'Unauthorized! No Auth Token found',
            token: token
        });
        return;
    }

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY!);
        req.user = decoded;
        next();
    } catch (error: any) {
        res.status(401).json({
            error: error.message,
            message: 'Unauthorized: error in checkLogin'
        });
    }
};
