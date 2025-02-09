import CollegeModel from '../schema/college.schema.js';
import { Request, Response } from 'express';

export const getAllCollegeList = async (req: Request, res: Response) => {
    try {
        const colleges = await CollegeModel.find();
        res.status(200).json({
            data: colleges,
            message: 'All Colleges',
            success: true
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'Internal server error while fetching colleges',
            error: error.message,
            success: false
        });
    }
};

export const deleteCollege = async (req: Request, res: Response) => {
    try {
        const { collegeId } = req.params;
        const resp = await CollegeModel.findOneAndDelete({ _id: collegeId });
        res.status(200).json({
            message: 'College deleted successfully',
            collegeId,
            data: resp,
            success: true
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'Internal server error while deleting college',
            error: error.message,
            success: false
        });
    }
};

export const updateCollege = async (req: Request, res: Response) => {
    try {
        const { collegeId } = req.params;
        const { collegeName, collegeLocation, email, passkey } = req.body;
        const resp = await CollegeModel.findOneAndUpdate(
            { _id: collegeId },
            { collegeName, collegeLocation, email, passkey },
            { new: true }
        );
        res.status(200).json({
            message: 'College updated successfully',
            data: resp,
            success: true
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'Internal server error while updating college',
            error: error.message,
            success: false
        });
    }
};
