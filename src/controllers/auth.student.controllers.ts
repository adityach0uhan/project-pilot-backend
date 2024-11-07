import { Request, Response } from 'express';
import StudentModel from '../schema/student.schema.js';
import TeacherModel from '../schema/teacher.schema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import sendEmail from '../utils/sendEmail.js';

export const studentRegister = async (
    req: Request,
    res: Response
): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        const {
            name,
            profilePic,
            email,
            department,
            password,
            semester,
            classRollNumber,
            enrollmentNumber,
            universityRollNumber
        } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        const student = await StudentModel.create({
            name,
            profilePic,
            email,
            department,
            password: hashedPassword,
            semester,
            classRollNumber,
            enrollmentNumber,
            universityRollNumber
        });
        const { password: _, ...studentData } = student.toObject();

        res.status(201).json({ student: studentData });
    } catch (error: any) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};
export const studentLogin = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { email, password } = req.body;

        const student = await StudentModel.findOne({ email });
        if (!student) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            student.password
        );
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid password' });
            return;
        }

        const token = jwt.sign(
            { id: student._id, role: student.role },
            process.env.JWT_SECRET_KEY!,
            { expiresIn: '15d' }
        );

        res.cookie('student_project_manager_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        })
            .status(200)
            .json({
                message: 'Student Logged in successfully',
                data: student,
                success: true,
                status: 200,
                token
            });
    } catch (error: any) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const studentOtpGenerate = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { email } = req.body;
        const student = await StudentModel.findOne({ email });
        if (!student) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        await sendEmail(
            email,
            'Student Project Manager!  Password reset OTP ',
            `Your OTP is ${otp} , will be expired within 5 minutes kindly ignore if you didn't request it`
        );
        student.otp = otp.toString();
        student.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        await student.save();

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error: any) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
}; //TODO:Create OTP Generation Limit

export const studentForgetPassword = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { email, otp, newPassword } = req.body;
        if (otp.length !== 6) {
            res.status(400).json({ message: '6 Digit OTP is Required' });
            return;
        }
        const student = await StudentModel.findOne({ email });
        if (!student) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }
        if (student.otp !== otp) {
            res.status(400).json({ message: 'Invalid OTP' });
            return;
        }
        if (new Date() > student.otpExpiry!) {
            res.status(400).json({ message: 'OTP expired' });
            return;
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        student.password = hashedPassword;
        student.otp = '';
        student.otpExpiry = undefined;
        await student.save();
        res.status(200).json({
            message:
                'Password reset successfully Login with your new password and correct email'
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const studentChangePassword = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { email, oldPassword, newPassword } = req.body;
        const student = await StudentModel.findOne({ email });
        if (!student) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }
        const isPasswordValid = await bcrypt.compare(
            oldPassword,
            student.password
        );
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid password' });
            return;
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        student.password = hashedPassword;
        await student.save();
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error: any) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};
