import express from 'express';
import { getAllCollegeList, deleteCollege, updateCollege } from '../controllers/superadmin.controller.js';
const router = express.Router();
router.get('/getallcollegelist', getAllCollegeList);
// router.post('/getCollegeById', getCollegeById);
router.put('/updateCollege/:collegeId', updateCollege);
router.delete('/deleteCollege/:collegeId', deleteCollege);
export default router;
