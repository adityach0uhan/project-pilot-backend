import { Router } from 'express';
import jwt from 'jsonwebtoken';
const router = Router();
router.get('/verify', async (req, res) => {
    const token = req.cookies.student_project_manager_token;
    const secret = process.env.JWT_SECRET_KEY;
    console.log('Verify Route Token: ', token);
    console.log('Verify Route Secret: ', secret);
    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized hai bhai, token nahi mila.'
        });
    }
    try {
        const decoded = jwt.verify(token, secret);
        console.log('Decoded token:', decoded);
        return res.status(200).json({
            message: 'Token verified successfully.',
            data: decoded
        });
    }
    catch (err) {
        console.error('Token verification failed:', err);
        return res.status(403).json({
            message: 'Invalid token ya expire ho gaya bhai.'
        });
    }
});
export default router;
