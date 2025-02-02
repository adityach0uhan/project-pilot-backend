import { Router } from 'express';
import { getAllProjects, createNewProject, getProjectByGroupNumber, updateProject, deleteProject } from '../controllers/project.controller.js';
const router = Router();
router.post('/create', createNewProject);
router.get('/all', getAllProjects);
router.post('/getProjectByGroupNumber', getProjectByGroupNumber);
router.put('/:projectId', updateProject);
router.delete('/:projectId', deleteProject);
export default router;
