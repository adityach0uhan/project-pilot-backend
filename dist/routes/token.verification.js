import { Router } from 'express';
const router = Router();
router.get('/verify', async (req, res) => {
    const token = req.cookies.student_project_manager_token;
    const secret = process.env.JWT_SECRET_KEY;
    console.log('Verify Route Token: ', token);
    console.log('Verify Route Secret: ', secret);
    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized hai bhai '
        });
    }
    res.send('Token verified');
});
export default router;
