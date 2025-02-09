import { Router } from 'express';
import StudentModel from '../schema/student.schema.js';
import ProjectModel from '../schema/project.schema.js';
import GroupModel from '../schema/group.schema.js';
import { deleteTeacher, updateTeacher } from '../controllers/auth.teacher.controller.js';
const router = Router();
router.get('/student/:collegeId/:semester/:branch', async (req, res) => {
    const { collegeId, semester, branch } = req.params;
    const students = await StudentModel.find({ collegeId, semester, branch });
    res.json({
        success: true,
        students,
        message: 'Students fetched successfully'
    });
});
router.get('/student/:studentId', async (req, res) => {
    const { studentId } = req.params;
    try {
        const student = await StudentModel.findById(studentId);
        res.json({
            success: true,
            student,
            message: 'Student fetched successfully'
        });
    }
    catch (error) {
        res.json({
            success: false,
            message: 'Student not found',
            error: error.message
        });
    }
});
router.get('/project/:collegeId/:semester/:branch', async (req, res) => {
    const { collegeId, semester, branch } = req.params;
    const project = await ProjectModel.find({ collegeId, semester, branch });
    res.json({
        success: true,
        project,
        message: 'Project fetched successfully'
    });
});
router.get('/project/:projectId', async (req, res) => {
    const { projectId } = req.params;
    const project = await ProjectModel.findOne({
        projectId
    });
    res.json({
        success: true,
        project,
        message: 'Project fetched successfully'
    });
});
router.get('/group/:collegeId/:semester/:branch', async (req, res) => {
    const { collegeId, semester, branch } = req.params;
    const group = await GroupModel.find({ collegeId, semester, branch });
    res.json({
        success: true,
        group,
        message: 'Group Data fetched successfully'
    });
});
router.get('/group/:groupId', async (req, res) => {
    const { groupId } = req.params;
    const group = await GroupModel.findOne({
        groupId
    });
    res.json({
        success: true,
        group,
        message: 'Group Data fetched successfully'
    });
});
router.put('/:_id', updateTeacher);
router.delete('/:_id', deleteTeacher);
export default router;
