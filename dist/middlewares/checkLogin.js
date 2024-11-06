import jwt from 'jsonwebtoken';
export const checkLogin = async (req, res, next) => {
    const token = await req.cookies.student_project_manager_token;
    if (!token) {
        res.status(401).json({ message: 'Unauthorized: No Token found' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({
            error: error.message,
            message: 'Unauthorized: error in checkLogin'
        });
    }
};
