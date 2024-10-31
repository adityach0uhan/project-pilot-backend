import { body } from 'express-validator';

export const studentRegisterValidation = [
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('profilePic')
        .isString()
        .optional()
        .withMessage('Profile picture is required'),
    body('email')
        .isEmail()
        .withMessage('Must be a valid email')
        .notEmpty()
        .withMessage('Email is required'),
    body('department')
        .isString()
        .notEmpty()
        .withMessage('Department is required'),
    body('password').isString().notEmpty().withMessage('Password is required'),
    body('semester').isNumeric().notEmpty().withMessage('Semester is required'),
    body('classRollNumber')
        .isString()
        .notEmpty()
        .withMessage('Class roll number is required'),
    body('enrollmentNumber')
        .isString()
        .notEmpty()
        .withMessage('Enrollment number is required'),
    body('universityRollNumber')
        .isString()
        .notEmpty()
        .withMessage('University roll number is required')
];
