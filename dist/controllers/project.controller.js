import ProjectModel from '../schema/project.schema.js';
export const createNewProject = async (req, res) => {
    try {
        const project = new ProjectModel(req.body);
        await project.save();
        res.status(201).json(project);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const getAllProjects = async (req, res) => {
    try {
        const projects = await ProjectModel.find();
        res.status(200).json(projects);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getProjectById = async (req, res) => {
    try {
        const project = await ProjectModel.findById(req.params.projectId);
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
