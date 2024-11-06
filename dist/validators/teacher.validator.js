import { body } from 'express-validator';
export const teacherRegisterValidation = [
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('profilePic')
        .isString()
        .optional()
        .withMessage('Profile picture is optional'),
    body('email').isEmail().notEmpty().withMessage('Email is required'),
    body('department')
        .isString()
        .notEmpty()
        .withMessage('Department is required'),
    body('password').isString().notEmpty().withMessage('Password is required'),
    body('designation')
        .isString()
        .notEmpty()
        .withMessage('Designation is required'),
    body('semester').isNumeric().notEmpty().withMessage('Semester is required'),
    body('employeeId')
        .isString()
        .notEmpty()
        .withMessage('Employee ID is required')
];
