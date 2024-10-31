import { Request, Response } from 'express';
import StudentModel from '../schema/student.schema.js';
import TeacherModel from '../schema/teacher.schema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

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
            {
                id: student._id,
                email: student.email,
                name: student.name,
                role: student.role
            },
            process.env.JWT_SECRET_KEY!,
            { expiresIn: '1d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        })
            .status(200)
            .json({ message: 'Logged in successfully' });
    } catch (error: any) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const teacherRegister = async (
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
            designation,
            semester,
            employeeId
        } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        const teacher = await TeacherModel.create({
            name,
            profilePic,
            email,
            department,
            password: hashedPassword,
            designation,
            employeeId,
            semester
        });
        const { password: _, ...teacherData } = teacher.toObject();
        res.status(201).json({ teacher: teacherData });
    } catch (error: any) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const teacherLogin = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { email, password } = req.body;
        const teacher = await TeacherModel.findOne({ email });
        if (!teacher) {
            res.status(404).json({ message: 'Teacher not found' });
            return; // Early return
        }
        const isPasswordValid = await bcrypt.compare(
            password,
            teacher.password
        );
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid password' });
            return;
        }
        const token = jwt.sign(
            {
                id: teacher._id,
                email: teacher.email,
                name: teacher.name,
                role: teacher.role
            },
            process.env.JWT_SECRET_KEY!,
            { expiresIn: '1d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        })
            .status(200)
            .json({ message: 'Logged in successfully' });
    } catch (error: any) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};
