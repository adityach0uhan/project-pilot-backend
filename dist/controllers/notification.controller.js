import NotificationModel from '../schema/notification.schema.js';
export const createNotification = async (req, res) => {
    try {
        const { heading, description, priority, branch, postedBy, collegeId } = req.body;
        const notification = new NotificationModel({
            heading,
            description,
            priority,
            branch,
            postedBy,
            collegeId
        });
        await notification.save();
        res.status(201).json({ success: true, notification });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getAllNotification = async (req, res) => {
    try {
        const { collegeId, branch } = req.params;
        const notifications = await NotificationModel.find({
            collegeId,
            branch
        });
        res.status(200).json({ success: true, notifications });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const deleteNotification = async (req, res) => {
    try {
        const { _id } = req.params;
        await NotificationModel.findByIdAndDelete(_id);
        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully'
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
