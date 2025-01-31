import { Schema, model, Document } from 'mongoose';

export interface ITeacher extends Document {
    name: string;
    email: string;
    profilePic: string;
    password: string;
    designation: string;
    teacherId: string;
    branch: string;
    collegeId: string;
    gender: string;
    otp: string;
    otpExpiry: Date;
    role: string;
    isHOD: boolean;
    collegeName: string;
}

const teacherSchema = new Schema<ITeacher>(
    {
        name: { type: String, required: true },
        otp: { type: String, required: false, default: null },
        otpExpiry: { type: Date, required: false, default: null },
        role: { type: String, default: 'teacher' },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        designation: { type: String, required: true },
        teacherId: { type: String, required: true, unique: true },
        branch: { type: String, required: true },
        collegeId: { type: String, required: true }, // Multi-tenant identifier
        gender: { type: String, required: true },
        collegeName: { type: String, required: false },
        isHOD: { type: Boolean, required: true, default: false },
        profilePic: { type: String, required: false }
    },
    { timestamps: true }
);

const TeacherModel = model<ITeacher>('Teacher', teacherSchema);
export default TeacherModel;
