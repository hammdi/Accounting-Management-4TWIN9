const Task = require('../models/Task');
const logger = require('../utils/logger');

// Create a new task
exports.createTask = async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            assignedTo: req.user._id,  // Assuming the user is logged in and their ID is in req.user._id
        });
        await task.save();
        logger.info(`Task created: ${task._id}`);
        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        logger.error(`Error creating task: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

// Get all tasks of a project
exports.getTasksByProject = async (req, res) => {
    try {
        const tasks = await Task.find({ _id: { $in: req.params.projectId } }).populate('assignedTo');
        res.status(200).json(tasks);
    } catch (error) {
        logger.error(`Error fetching tasks: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

// Get a specific task
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('assignedTo');
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json(task);
    } catch (error) {
        logger.error(`Error fetching task: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

// Update a task by ID
exports.updateTask = async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json({ message: 'Task updated successfully', updatedTask });
    } catch (error) {
        logger.error(`Error updating task: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

// Delete a task by ID
exports.deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting task: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};
