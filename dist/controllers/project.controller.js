import ProjectModel from '../schema/project.schema.js';
import GroupModel from '../schema/group.schema.js';
export const createNewProject = async (req, res) => {
    try {
        const { collegeId, projectName, description, createdBy, groupNumber, status, branch, semester } = req.body;
        const group = await GroupModel.findOne({ groupNumber });
        if (!group) {
            res.status(404).json({
                success: false,
                message: 'Group not found',
                groupNumber
            });
            return;
        }
        const project = new ProjectModel({
            collegeId,
            projectName,
            description,
            createdBy,
            groupNumber,
            status,
            groupId: group._id,
            branch,
            semester
        });
        await project.save();
        group.projectId = project._id;
        group.projectName = projectName;
        await group.save();
        res.status(201).json({ success: true, project, group });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const getAllProjects = async (req, res) => {
    try {
        const { collegeId, branch } = req.params;
        const projects = await ProjectModel.find({ collegeId, branch });
        res.status(200).json({ success: true, projects });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getProjectByGroupNumber = async (req, res) => {
    try {
        const { groupNumber } = req.body;
        const project = await ProjectModel.findOne({ groupNumber });
        if (!project) {
            res.status(404).json({
                success: false,
                message: 'Project not found'
            });
            return;
        }
        res.status(200).json({ success: true, project });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const updateProject = async (req, res) => {
    try {
        const project = await ProjectModel.findByIdAndUpdate(req.params.projectId, req.body, { new: true });
        if (!project) {
            res.status(404).json({ message: 'Project not found' });
            return;
        }
        res.status(200).json(project);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const deleteProject = async (req, res) => {
    try {
        const project = await ProjectModel.findByIdAndDelete(req.params.projectId);
        if (!project) {
            res.status(404).json({ message: 'Project not found' });
            return;
        }
        res.status(200).json({ message: 'Project deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getProjectsByGroupId = async (req, res) => {
    try {
        console.log(req.params.groupId);
        const projects = await ProjectModel.find({
            Group: req.params.groupId
        });
        res.status(200).json(projects);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
