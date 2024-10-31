import express from 'express';
import { studentRegisterValidation } from '../validators/student.validator.js';
import { teacherRegisterValidation } from '../validators/teacher.validator.js';
import {
    studentRegister,
    studentLogin,
    teacherRegister,
    teacherLogin
} from '../controllers/auth.controllers.js';

const router = express.Router();

router.post('/student/login', studentLogin);
router.post('/teacher/login', teacherLogin);
router.post('/student/register', studentRegisterValidation, studentRegister);
router.post('/teacher/register', teacherRegisterValidation, teacherRegister);

export default router;
