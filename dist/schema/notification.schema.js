import { Schema, model } from 'mongoose';
const notificationSchema = new Schema({
    collegeId: { type: String, required: true },
    heading: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: String, required: true },
    branch: { type: String, required: true },
    postedBy: { type: String, required: true }
}, { timestamps: true });
const NotificationModel = model('Notification', notificationSchema);
export default NotificationModel;
