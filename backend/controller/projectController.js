const Project = require('../models/Project');
const logger = require('../utils/logger');

exports.createProject = async (req, res) => {
    try {
        const project = new Project({ ...req.body, owner: req.user._id });
        await project.save();
        logger.info(`Project created: ${project._id}`);
        res.status(201).json({ message: 'Project created successfully', project });
    } catch (error) {
        logger.error(`Error creating project: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

exports.getMyProjects = async (req, res) => {
    try {
        const projects = await Project.find({ owner: req.user._id }).populate('teamMembers tasks.assignedTo');
        res.status(200).json(projects);
    } catch (error) {
        logger.error(`Error fetching projects: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Project not found' });
        res.status(200).json({ message: 'Project updated', updated });
    } catch (error) {
        logger.error(`Error updating project: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const deleted = await Project.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Project not found' });
        res.status(200).json({ message: 'Project deleted' });
    } catch (error) {
        logger.error(`Error deleting project: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};
