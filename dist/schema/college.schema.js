import { Schema, model } from 'mongoose';
const collegeSchema = new Schema({
    collegeName: { type: String, required: true },
    collegeLocation: { type: String, required: true },
    collegeId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'college' },
    email: { type: String, required: true },
    passkey: { type: String, required: true } // This passkey helps create the first admin
}, { timestamps: true });
const CollegeModel = model('College', collegeSchema);
export default CollegeModel;
