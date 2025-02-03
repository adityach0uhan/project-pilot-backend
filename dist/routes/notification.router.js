import { Router } from 'express';
import { getAllNotification, deleteNotification, createNotification } from '../controllers/notification.controller.js';
const router = Router();
router.get('/getAllNotification', getAllNotification);
router.post('/createNotification', createNotification);
router.delete('/deleteNotification', deleteNotification);
export default router;
