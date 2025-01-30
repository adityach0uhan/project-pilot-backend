import { Schema, model, Document } from 'mongoose';

export interface IAdmin extends Document {
    name: string;
    email: string;
    password: string;
    profilePic?: string;
    role?: string;
    otp?: string;
    otpExpiry?: Date;
}

const superadminSchema = new Schema<IAdmin>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        otp: { type: String, default: null },
        otpExpiry: { type: Date, default: null },
        profilePic: { type: String, default: null },
        role: { type: String, default: 'superadmin' }
    },
    { timestamps: true }
);

const SuperAdminModel = model<IAdmin>('SuperAdmin', superadminSchema);
export default SuperAdminModel;
