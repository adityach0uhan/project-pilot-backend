// student.model.ts
import { Schema, model, Document } from 'mongoose';

export interface IStudent extends Document {
    name: string;
    email: string;
    password: string;
    profilePic: string;
    semester: string;
    branch: string;
    teamId: Schema.Types.ObjectId;
    section: string;
    role: string;
    universityRollNumber: string;
    classRollNumber: string;
    gender: string;
    otp: string;
    otpExpiry: Date;
    collegeId: string;
    collegeName: string;
}

const studentSchema = new Schema<IStudent>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        profilePic: { type: String, required: false, default: null },
        password: { type: String, required: true },
        semester: { type: String, required: true },
        branch: { type: String, required: true },
        role: { type: String, default: 'student' },
        section: { type: String, required: true },
        universityRollNumber: { type: String, required: true },
        classRollNumber: { type: String, required: true },
        collegeName: { type: String, required: false },
        gender: { type: String, required: true },
        otp: { type: String, required: false, default: null },
        otpExpiry: { type: Date, required: false, default: null },
        collegeId: { type: String, required: true },
        teamId: {
            type: Schema.Types.ObjectId,
            ref: 'Group',
            default: null,
            required: false
        }
    },
    { timestamps: true }
);

const StudentModel = model<IStudent>('Student', studentSchema);
export default StudentModel;
