import { Router } from 'express';
import {
    createNewGroup,
    getGroupInfo,
    getAllGroups,
    getGroup,
    updateGroup,
    deleteGroup,
    kickMember,
    requestToJoinGroup,
    makeGroupRequestAcceptOrReject
} from '../controllers/group.controllers.js';
import { checkLogin } from '../middlewares/checkLogin.js';
import { checkTeacher } from '../middlewares/checkTeacher.js';

const router = Router();

router.post('/create', createNewGroup);
router.post('/requesttojoin/:inviteCode', requestToJoinGroup);
router.post('/managejoinrequests', makeGroupRequestAcceptOrReject);
router.put('/:groupId/kick/:memberId', kickMember);
router.post('/groupInfo', getGroupInfo);
router.get('/getAllGroups', getAllGroups);
router.get('/:groupId', getGroup);
router.put('/:groupId', updateGroup);
router.delete('/:groupId', deleteGroup);

export default router;
