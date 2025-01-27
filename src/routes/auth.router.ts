import express, { Router } from 'express';
import { studentRegisterValidation } from '../validators/student.validator.js';
import { teacherRegisterValidation } from '../validators/teacher.validator.js';
import {
    studentRegister,
    studentLogin,
    studentForgetPassword,
    studentChangePassword,
    studentOtpGenerate
} from '../controllers/auth.student.controllers.js';
import {
    teacherRegister,
    teacherLogin,
    teacherOtpGenerate,
    teacherForgetPassword,
    teacherChangePassword
} from '../controllers/auth.teacher.controllers.js';
import { checkLogin } from '../middlewares/checkLogin.js';
import { checkTeacher } from '../middlewares/checkTeacher.js';
const router: Router = express.Router();

router.post('/student/register', studentRegisterValidation, studentRegister);
router.post('/teacher/register', teacherRegisterValidation, teacherRegister);

router.post('/student/login', studentLogin);
router.post('/teacher/login', teacherLogin);

// TODO:make sure to use  checkLogin later rn removing it so that it can be teated
router.put('/student/change-password', studentChangePassword);
router.put(
    '/teacher/change-password',
    checkLogin,
    checkTeacher,
    teacherChangePassword
);

router.post('/student/forgot-password-otp-generate', studentOtpGenerate);
router.post('/teacher/forgot-password-otp-generate', teacherOtpGenerate);

router.post('/student/forgot-password', studentForgetPassword);
router.post('/teacher/forgot-password', teacherForgetPassword);

export default router;
