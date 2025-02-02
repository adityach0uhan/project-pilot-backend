import { Schema, model, Document } from 'mongoose';

export interface ICollege extends Document {
    collegeId: string;
    heading: string;
    description: string;
    priority: string;
    branch: string;
    postedBy: string;
}

const collegeSchema = new Schema<ICollege>(
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

const CollegeModel = model<ICollege>('College', collegeSchema);
