import { Router } from 'express';
import {
    getAllNotification,
    deleteNotification,
    createNotification
} from '../controllers/notification.controller.js';

const router = Router();

router.get('/getAllNotification/:collegeId/:branch', getAllNotification);
router.post('/createNotification', createNotification);
router.delete('/deleteNotification/:_id', deleteNotification);

export default router;
