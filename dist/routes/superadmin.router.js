import express from 'express';
import { getAllCollegeList } from '../controllers/superadmin.controller.js';
const router = express.Router();
router.get('/getallcollegelist', getAllCollegeList);
// router.post('/getCollegeById', getCollegeById);
// router.post('/updateCollege', updateCollege);
// router.post('/deleteCollege', deleteCollege);
export default router;
