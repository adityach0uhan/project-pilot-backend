import TeacherModel from '../schema/teacher.schema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import sendEmail from '../utils/sendEmail.js';
export const teacherRegister = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        const { name, profilePic, email, department, password, designation, employeeId, teacherId, gender, branch, collegeId, isHOD } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        const teacher = await TeacherModel.create({
            name,
            profilePic,
            email,
            department,
            password: hashedPassword,
            designation,
            employeeId,
            branch,
            teacherId,
            collegeId,
            isHOD,
            gender
        });
        const { password: _, ...teacherData } = teacher.toObject();
        res.status(201).json({
            teacher: teacherData,
            success: true,
            message: 'Teacher registered successfully Redirecting to login page'
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Internal server error while registering teacher',
            error: error.message,
            success: false
        });
    }
};
export const teacherLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const teacher = await TeacherModel.findOne({ email });
        if (!teacher) {
            res.status(404).json({
                message: 'Invalid Credentials teacher not found',
                success: false
            });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, teacher.password);
        if (!isPasswordValid) {
            res.status(401).json({
                message: 'Invalid Id or Password',
                success: false
            });
            return;
        }
        const secret = process.env.JWT_SECRET_KEY;
        if (!secret) {
            throw new Error(' JWT secret key not found');
        }
        const token = jwt.sign({
            id: teacher._id,
            role: teacher.role,
            collegeId: teacher.collegeId
        }, secret, { expiresIn: '2d' });
        res.cookie('project_pilot_token', token, {
            httpOnly: true,
            secure: true,
            maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
            sameSite: 'none'
        });
        res.status(200).json({
            message: 'Logged in successfully',
            success: true,
            data: teacher
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
            success: false
        });
    }
};
//TODO: Check Below functions
export const teacherOtpGenerate = async (req, res) => {
    try {
        const { email } = req.body;
        const teacher = await TeacherModel.findOne({ email });
        if (!teacher) {
            res.status(404).json({ message: 'Teacher not found' });
            return;
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        await sendEmail(email, 'Student Project Manager!  Password reset OTP ', `Your OTP is ${otp} , will be expired within 5 minutes kindly ignore if you didn't request it`);
        teacher.otp = otp.toString();
        teacher.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        await teacher.save();
        res.status(200).json({ message: 'OTP sent successfully' });
    }
    catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
}; //TODO:Create OTP Generation Limit
export const teacherForgetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const teacher = await TeacherModel.findOne({ email });
        if (otp.length !== 6) {
            res.status(400).json({ message: '6 Digit OTP is Required' });
            return;
        }
        if (!teacher) {
            res.status(404).json({ message: 'Teacher not found' });
            return;
        }
        if (teacher.otp !== otp) {
            res.status(400).json({ message: 'Invalid OTP' });
            return;
        }
        if (new Date() > teacher.otpExpiry) {
            res.status(400).json({ message: 'OTP expired' });
            return;
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        teacher.password = hashedPassword;
        teacher.otp = '';
        // teacher.otpExpiry = undefined;
        await teacher.save();
        res.status(200).json({
            message: 'Password reset successfully Login with your new password and correct email'
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};
export const teacherChangePassword = async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;
        const teacher = await TeacherModel.findOne({ email });
        if (!teacher) {
            res.status(404).json({ message: 'Teacher not found' });
            return;
        }
        const isPasswordValid = await bcrypt.compare(oldPassword, teacher.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: 'Invalid old password' });
            return;
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        teacher.password = hashedPassword;
        await teacher.save();
        res.status(200).json({ message: 'Password changed successfully' });
    }
    catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};
export const updateTeacher = async (req, res) => {
    const { _id } = req.params;
    try {
        const { name, email, gender, branch, semester, teacherId } = req.body;
        const teacher = await TeacherModel.findOneAndUpdate({ _id }, {
            name,
            email,
            gender,
            branch,
            semester,
            teacherId
        }, { new: true });
        if (!teacher) {
            res.status(404).json({ message: 'Teacher not found' });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Teacher updated successfully',
            teacher
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
export const deleteTeacher = async (req, res) => {
    const { _id } = req.params;
    try {
        const teacher = await TeacherModel.findByIdAndDelete({ _id });
        if (!teacher) {
            res.status(404).json({ message: 'Teacher not found' });
            return;
        }
        res.status(200).json({ message: 'Teacher deleted successfully' });
    }
    catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};
