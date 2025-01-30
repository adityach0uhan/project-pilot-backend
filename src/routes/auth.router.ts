import express, { Router } from 'express';

//TODO: Apply Validators
// import { studentRegisterValidation } from '../validators/student.validator.js';
// import { teacherRegisterValidation } from '../validators/teacher.validator.js';
import {
    studentRegister,
    studentLogin,
    studentForgetPassword,
    studentChangePassword,
    studentOtpGenerate
} from '../controllers/auth.student.controller.js';
import {
    teacherRegister,
    teacherLogin,
    teacherOtpGenerate,
    teacherForgetPassword,
    teacherChangePassword
} from '../controllers/auth.teacher.controller.js';
import {
    collegeChangePassword,
    collegeForgetPassword,
    collegeLogin,
    collegeOtpGenerate,
    collegeRegister
} from '../controllers/auth.college.controller.js';
import {
    superAdminLogin,
    superAdminRegister
} from '../controllers/super.admin.auth.controller.js';

const router: Router = express.Router();

router.post('/student/register', studentRegister);
router.post('/teacher/register', teacherRegister);
router.post('/college/register', collegeRegister);
router.post('/super-admin/register', superAdminRegister);

router.post('/student/login', studentLogin);
router.post('/teacher/login', teacherLogin);
router.post('/college/login', collegeLogin);
router.post('/super-admin/login', superAdminLogin);

router.put('/student/change-password', studentChangePassword);
router.put('/teacher/change-password', teacherChangePassword);
router.put('/college/change-password', collegeChangePassword);

router.post('/student/forgot-password-otp-generate', studentOtpGenerate);
router.post('/teacher/forgot-password-otp-generate', teacherOtpGenerate);
router.post('/college/forgot-password-otp-generate', collegeOtpGenerate);

router.post('/student/forgot-password', studentForgetPassword);
router.post('/teacher/forgot-password', teacherForgetPassword);
router.post('/college/forgot-password', collegeForgetPassword);
export default router;
