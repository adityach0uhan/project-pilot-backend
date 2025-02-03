import NotificationModel from '../schema/notification.schema.js';
export const createNotification = async (req, res) => {
    try {
        const notification = new NotificationModel(req.body);
        await notification.save();
        res.status(201).json({ notification });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getAllNotification = async (req, res) => {
    try {
        const notifications = await NotificationModel.find();
        res.status(200).json({ notifications });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.body;
        await NotificationModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Notification deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
