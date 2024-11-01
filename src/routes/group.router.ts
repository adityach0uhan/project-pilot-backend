import { Router } from 'express';
import { createNewGroup } from '../controllers/group.controllers.js';

const router = Router();

router.post('/create', createNewGroup);
// router.post('/join', joinGroup);
// router.get('/all', getAllGroups);
// router.get('/:groupId', getGroup);
// router.put('/:groupId', updateGroup);
// router.delete('/:groupId', deleteGroup);

export default router;
