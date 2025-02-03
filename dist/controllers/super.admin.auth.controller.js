import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import SuperAdminModel from '../schema/superadmin.schema.js';
export const superAdminRegister = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        const { name, email, profilePic, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const superadmin = await SuperAdminModel.create({
            name,
            email,
            profilePic,
            password: hashedPassword
        });
        console.log('Super Admin', superadmin);
        const { password: _, ...superAdminData } = superadmin.toObject();
        res.status(201).json({
            data: superAdminData,
            message: 'SuperAdmin registered successfully Redirecting to login page',
            success: true
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Internal server error while registering superadmin',
            error: error.message,
            success: false
        });
    }
};
export const superAdminLogin = async (req, res) => {
    try {
        const { email, password } = await req.body;
        const superadmin = await SuperAdminModel.findOne({ email });
        if (!superadmin) {
            res.status(404).json({
                message: ' SuperAdmin not found',
                success: false
            });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, superadmin.password);
        if (!isPasswordValid) {
            res.status(401).json({
                message: 'Invalid Id or Password',
                success: false
            });
            return;
        }
        const secret = process.env.JWT_SECRET_KEY;
        if (!secret) {
            throw new Error('JWT Secret key not found');
        }
        const token = jwt.sign({
            id: superadmin._id,
            role: superadmin.role
        }, secret, { expiresIn: '2d' });
        res.cookie('project_pilot_token', token, {
            httpOnly: true,
            secure: true,
            maxAge: 2 * 24 * 60 * 60 * 1000,
            sameSite: 'none'
        });
        res.status(200).json({
            message: ' SuperAdmin Logged in successfully',
            data: superadmin,
            success: true,
            token
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            message: 'Internal server error while logging in superadmin',
            error: error.message,
            success: false
        });
    }
};
