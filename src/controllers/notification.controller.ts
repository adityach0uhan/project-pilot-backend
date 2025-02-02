import NotificationModel from '../schema/notification.schema.js';
import { Request, Response } from 'express';

export const createNotification = async (req: Request, res: Response) => {
    try {
        const notification = new NotificationModel(req.body);
        await notification.save();
        res.status(201).json({ notification });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllNotification = async (req: Request, res: Response) => {
    try {
        const notifications = await NotificationModel.find();
        res.status(200).json({ notifications });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteNotification = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        await NotificationModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
