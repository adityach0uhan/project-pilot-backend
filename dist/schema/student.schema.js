import { Schema, model } from 'mongoose';
const studentSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profilePic: { type: String, required: false },
    password: { type: String, required: true },
    department: { type: String, required: true },
    role: { type: String, required: true, default: 'student' },
    semester: { type: Number, required: true },
    enrollmentNumber: { type: String, required: true, unique: true },
    classRollNumber: { type: String, required: true, unique: true },
    universityRollNumber: { type: String, required: true, unique: true },
    otp: { type: String, required: false },
    otpExpiry: { type: Date, required: false }
}, {
    timestamps: true
});
const StudentModel = model('Student', studentSchema);
export default StudentModel;
