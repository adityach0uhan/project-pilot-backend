import { Request, Response } from 'express';
import StudentModel from '../schema/student.schema.js';
import TeacherModel from '../schema/teacher.schema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import sendEmail from '../utils/sendEmail.js';

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
