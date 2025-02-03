import StudentModel from '../schema/student.schema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import sendEmail from '../utils/sendEmail.js';
export const studentRegister = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        const { name, email, profilePic, department, password, semester, branch, section, classRollNumber, gender, universityRollNumber, collegeId } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        const student = await StudentModel.create({
            name,
            email,
            profilePic,
            department,
            password: hashedPassword,
            semester,
            branch,
            section,
            classRollNumber,
            gender,
            universityRollNumber,
            collegeId
        });
        const { password: _, ...studentData } = student.toObject();
        res.status(201).json({
            Student_Data: studentData,
            message: 'Student registered successfully Redirecting to login page',
            success: true
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Internal server error while registering student',
            error: error.message,
            success: false
        });
    }
};
export const studentLogin = async (req, res) => {
    try {
        const { email, password } = await req.body;
        const student = await StudentModel.findOne({ email });
        if (!student) {
            res.status(404).json({
                message: 'Student not found in the database Login error',
                success: false
            });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, student.password);
        if (!isPasswordValid) {
            res.status(401).json({
                message: 'Invalid Id or Password',
                success: false
            });
            return;
        }
        const secret = process.env.JWT_SECRET_KEY;
        if (!secret) {
            throw new Error('JWT Secret Key is not defined');
        }
        const token = jwt.sign({
            id: student._id,
            role: student.role,
            collegeId: student.collegeId
        }, secret, { expiresIn: '2d' });
        res.cookie('project_pilot_token', token, {
            httpOnly: true,
            secure: true,
            maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
            sameSite: 'none'
        });
        res.status(200).json({
            message: 'Student logged in successfully',
            data: student,
            success: true,
            token
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            message: 'Internal server error while logging in student',
            error: error.message
        });
    }
};
// TODO: Implement the following functions
export const studentOtpGenerate = async (req, res) => {
    try {
        const { collegeId } = req.params;
        const { email } = req.body;
        const student = await StudentModel.findOne({ collegeId, email });
        if (!student) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        await sendEmail(email, 'Student Project Manager!  Password reset OTP ', `Your OTP is ${otp}, it will expire in 5 minutes. Kindly ignore if you didn't request it.`);
        student.otp = otp.toString();
        student.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        await student.save();
        res.status(200).json({ message: 'OTP sent successfully' });
    }
    catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};
export const studentForgetPassword = async (req, res) => {
    try {
        const { collegeId } = req.params;
        const { email, otp, newPassword } = req.body;
        if (otp.length !== 6) {
            res.status(400).json({ message: '6 Digit OTP is Required' });
            return;
        }
        const student = await StudentModel.findOne({ collegeId, email });
        if (!student) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }
        if (student.otp !== otp) {
            res.status(400).json({ message: 'Invalid OTP' });
            return;
        }
        if (new Date() > student.otpExpiry) {
            res.status(400).json({ message: 'OTP expired' });
            return;
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        student.password = hashedPassword;
        student.otp = '';
        student.otpExpiry = new Date();
        await student.save();
        res.status(200).json({
            message: 'Password reset successfully. Log in with your new password and correct email.'
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};
export const studentChangePassword = async (req, res) => {
    try {
        const { collegeId } = req.params;
        const { email, oldPassword, newPassword } = req.body;
        const student = await StudentModel.findOne({ collegeId, email });
        if (!student) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }
        const isPasswordValid = await bcrypt.compare(oldPassword, student.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid password' });
            return;
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        student.password = hashedPassword;
        await student.save();
        res.status(200).json({ message: 'Password changed successfully' });
    }
    catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};
