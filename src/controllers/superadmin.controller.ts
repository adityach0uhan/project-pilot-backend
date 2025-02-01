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
