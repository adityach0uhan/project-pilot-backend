import { Schema, model, Document } from 'mongoose';

export interface IStudent extends Document {
    name: string;
    profilePic: string;
    email: string;
    department: string;
    password: string;
    semester: number;
    role: string;
    classRollNumber: string;
    enrollmentNumber: string;
    universityRollNumber: string;
}

const studentSchema = new Schema<IStudent>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        profilePic: { type: String, required: false },
        password: { type: String, required: true },
        department: { type: String, required: true },
        role: { type: String, required: true, default: 'student' },
        semester: { type: Number, required: true },
        enrollmentNumber: { type: String, required: true, unique: true },
        classRollNumber: { type: String, required: true, unique: true },
        universityRollNumber: { type: String, required: true, unique: true }
    },
    {
        timestamps: true
    }
);

const Student = model<IStudent>('Student', studentSchema);

export default Student;
