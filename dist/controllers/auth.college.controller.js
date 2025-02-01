import TeacherModel from '../schema/teacher.schema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import sendEmail from '../utils/sendEmail.js';
import CollegeModel from '../schema/college.schema.js';
import StudentModel from '../schema/student.schema.js';
export const collegeRegister = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        const { collegeName, collegeLocation, email, password, passkey } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        async function generateCode() {
            const digits = Math.floor(1000 + Math.random() * 9000);
            const alphabet = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            return `${digits}${alphabet}`;
        }
        const clgId = await generateCode();
        const college = await CollegeModel.create({
            collegeName,
            email,
            collegeLocation,
            collegeId: clgId,
            password: hashedPassword,
            passkey
        });
        const { password: _, ...collegeData } = college.toObject();
        res.status(201).json({
            teacher: collegeData,
            success: true,
            message: 'College registered successfully Redirecting to login page'
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Internal server error while registering your college',
            error: error.message,
            success: false
        });
    }
};
export const collegeLogin = async (req, res) => {
    try {
        const { email, password, passkey } = req.body;
        const college = await CollegeModel.findOne({ email });
        if (!college) {
            res.status(404).json({
                message: 'Invalid Credentials college not found',
                success: false
            });
            return;
        }
        if (college.passkey !== passkey) {
            res.status(401).json({
                message: 'Invalid Id or Password',
                success: false
            });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, college.password);
        if (!isPasswordValid) {
            res.status(401).json({
                message: 'Invalid Id or Password',
                success: false
            });
            return;
        }
        const token = jwt.sign({
            id: college._id,
            role: college.role,
            collegeId: college.collegeId
        }, process.env.JWT_SECRET_KEY, { expiresIn: '15d' });
        res.cookie('project_pilot_token', token, {
            httpOnly: true,
            secure: true,
            maxAge: 15 * 24 * 60 * 60 * 1000,
            sameSite: 'none'
        })
            .status(200)
            .json({
            message: 'Logged in successfully',
            success: true,
            data: college
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
export const collegeOtpGenerate = async (req, res) => {
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
export const collegeForgetPassword = async (req, res) => {
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
export const collegeChangePassword = async (req, res) => {
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
export const getAllStudents = async (req, res) => {
    try {
        const { collegeId } = req.params;
        const students = await StudentModel.find({ collegeId });
        res.status(200).json({
            message: 'Fetched all students successfully',
            students,
            success: true
        });
    }
    catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({
            message: 'Internal server error',
            success: false,
            error: error.message || error
        });
    }
};
export const getAllTeachers = async (req, res) => {
    try {
        const { collegeId } = req.params;
        const teachers = await TeacherModel.find({ collegeId });
        res.status(200).json({
            message: 'Fetched All Teachers',
            teachers,
            success: true
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const getStudentById = async (req, res) => {
    try {
        const student = await StudentModel.findById(req.params.id);
        res.status(200).json({
            message: 'Fetched Student',
            student,
            success: true
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const getTeacherById = async (req, res) => {
    try {
        const teacher = await TeacherModel.findById(req.params.id);
        res.status(200).json({
            message: 'Fetched Teacher',
            teacher,
            success: true
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const deleteStudentById = async (req, res) => {
    try {
        await StudentModel.findByIdAndDelete(req.params.studentId);
        res.status(200).json({
            message: 'Student Deleted',
            success: true
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const deleteTeacherById = async (req, res) => {
    try {
        await TeacherModel.findByIdAndDelete(req.params.teacherId);
        res.status(200).json({
            message: 'Teacher Deleted',
            success: true
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
