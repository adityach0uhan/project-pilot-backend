import { Router } from 'express';
import { deleteStudentById, getAllStudents, getAllTeachers, getStudentById, getTeacherById, deleteTeacherById } from '../controllers/auth.college.controller.js';
const router = Router();
router.get('/', (req, res) => {
    res.send('Hello from College Router');
});
router.get('/allstudents/:collegeId', getAllStudents);
router.get('/allteachers/:collegeId', getAllTeachers);
router.get('/student/:id', getStudentById);
router.get('/teacher/:id', getTeacherById);
router.delete('/student/:studentId', deleteStudentById);
router.delete('/teacher/:teacherId', deleteTeacherById);
export default router;
