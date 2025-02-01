import CollegeModel from '../schema/college.schema.js';
export const getAllCollegeList = async (req, res) => {
    try {
        const colleges = await CollegeModel.find();
        res.status(200).json({
            data: colleges,
            message: 'All Colleges',
            success: true
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Internal server error while fetching colleges',
            error: error.message,
            success: false
        });
    }
};
