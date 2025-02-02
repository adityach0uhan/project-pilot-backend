import { Schema, model, Document } from 'mongoose';

export interface INotification extends Document {
    collegeId: string;
    heading: string;
    description: string;
    priority: string;
    branch: string;
    postedBy: string;
}

const notificationSchema = new Schema<INotification>(
    {
        collegeId: { type: String, required: true },
        heading: { type: String, required: true },
        description: { type: String, required: true },
        priority: { type: String, required: true },
        branch: { type: String, required: true },
        postedBy: { type: String, required: true }
    },
    { timestamps: true }
);

const CollegeModel = model<INotification>('Notification', notificationSchema);
