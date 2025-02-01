import { Schema, model } from 'mongoose';
const superadminSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    profilePic: { type: String, default: null },
    role: { type: String, default: 'superadmin' }
}, { timestamps: true });
const SuperAdminModel = model('SuperAdmin', superadminSchema);
export default SuperAdminModel;
