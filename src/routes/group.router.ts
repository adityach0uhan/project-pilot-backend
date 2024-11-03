import { Router } from 'express';
import {
    createNewGroup,
    joinGroup,
    getGroupInfo,
    getAllGroups,
    getGroup,
    updateGroup,
    deleteGroup,
    kickMember
} from '../controllers/group.controllers.js';
import { checkLogin } from '../middlewares/checkLogin.js';
import { checkTeacher } from '../middlewares/checkTeacher.js';

const router = Router();

router.post('/create', createNewGroup);
router.post('/join/:inviteCode', joinGroup);
router.put('/:groupId/kick/:memberId', kickMember);
router.get('/groupInfo', checkLogin, getGroupInfo);
router.get('/getAllGroups', getAllGroups);
router.get('/:groupId', getGroup);
router.put('/:groupId', updateGroup);
router.delete('/:groupId', deleteGroup);

export default router;
