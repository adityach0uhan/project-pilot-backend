import { Router } from 'express';

const router = Router();

router.get('/getAllNotification', getAllNotification);
router.post('/createNotification', getAllNotification);
router.delete('/deleteNotification', deleteNotification);

export default router;
