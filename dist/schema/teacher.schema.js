import { Schema, model } from 'mongoose';
const teacherSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profilePic: { type: String, required: false },
    password: { type: String, required: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    role: { type: String, required: true, default: 'teacher' },
    semester: { type: Number, required: true },
    employeeId: { type: String, required: true, unique: true },
    otp: { type: String, required: false },
    otpExpiry: { type: Date, required: false }
}, {
    timestamps: true
});
const TeacherModel = model('Teacher', teacherSchema);
export default TeacherModel;
