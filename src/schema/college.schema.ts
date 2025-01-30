import { Schema, model, Document } from 'mongoose';

export interface ICollege extends Document {
    collegeName: string;
    collegeLocation: string;
    collegeId: string;
    role: string;
    password: string;
    passkey: string;
    email: string;
}

const collegeSchema = new Schema<ICollege>(
    {
        collegeName: { type: String, required: true },
        collegeLocation: { type: String, required: true },
        collegeId: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, default: 'college' },
        email: { type: String, required: true },
        passkey: { type: String, required: true } // This passkey helps create the first admin
    },
    { timestamps: true }
);

const CollegeModel = model<ICollege>('College', collegeSchema);

export default CollegeModel;
