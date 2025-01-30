import { Schema, model } from 'mongoose';
const teacherSchema = new Schema({
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
    isHOD: { type: Boolean, required: true, default: false },
    profilePic: { type: String, required: false }
}, { timestamps: true });
const TeacherModel = model('Teacher', teacherSchema);
export default TeacherModel;
