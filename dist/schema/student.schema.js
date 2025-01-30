// student.model.ts
import { Schema, model } from 'mongoose';
const studentSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profilePic: { type: String, required: false, default: null },
    password: { type: String, required: true },
    semester: { type: Number, required: true },
    branch: { type: String, required: true },
    role: { type: String, default: 'student' },
    section: { type: String, required: true },
    universityRollNumber: { type: String, required: true },
    classRollNumber: { type: String, required: true },
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
}, { timestamps: true });
const StudentModel = model('Student', studentSchema);
export default StudentModel;
