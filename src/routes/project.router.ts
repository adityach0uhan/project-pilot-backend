import { Router } from 'express';
import {
    getAllProjects,
    createNewProject,
    getProjectById,
    updateProject,
    deleteProject,
    getProjectsByGroupId
} from '../controllers/project.controller.js';
const router = Router();

router.post('/create', createNewProject);
router.get('/all', getAllProjects);
router.get('//:projectId', getProjectById);
router.put('/:projectId', updateProject);
router.delete('/:projectId', deleteProject);
router.get('/group/:groupId', getProjectsByGroupId);

export default router;
