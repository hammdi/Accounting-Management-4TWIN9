const Task = require('../models/Task');
const Project = require('../models/Project');
const logger = require('../utils/logger');
const mongoose = require('mongoose');

// Get all tasks of a project
exports.getTasksByProject = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.projectId)) {
            return res.status(400).json({ error: 'Invalid project ID' });
        }

        const tasks = await Task.find({ project: req.params.projectId })
            .select('_id title description status priority dueDate project assignedTo')
            .populate('project', 'name')
            .populate('assignedTo', 'name') // Add this line to populate user name
            .lean();

        if (!tasks) {
            return res.status(404).json({ message: 'No tasks found for this project' });
        }

        res.status(200).json(tasks);
    } catch (error) {
        logger.error(`Error fetching tasks: ${error.message}`);
        res.status(500).json({ 
            error: 'Server error',
            details: error.message
        });
    }
};

// Create a new task
exports.createTask = async (req, res) => {
    try {
        // Validate required fields
        if (!req.body.project) {
            return res.status(400).json({ error: 'Project ID is required' });
        }

        // Create new task
        const task = new Task({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status || 'To Do',
            priority: req.body.priority || 'Medium',
            dueDate: req.body.dueDate,
            project: req.body.project,
            assignedTo: req.user._id
        });

        // Save the task
        await task.save();
        
        // Add the task to the project's tasks array
        await Project.findByIdAndUpdate(
            req.body.project,
            { $push: { tasks: task._id } },
            { new: true }
        );

        // Return the created task with minimal populated data
        const createdTask = await Task.findById(task._id)
            .select('_id title description status priority dueDate project')
            .populate('project', 'name')
            .lean();

        res.status(201).json({
            message: 'Task created successfully',
            task: createdTask
        });

    } catch (error) {
        logger.error(`Error creating task: ${error.message}`);
        res.status(400).json({ 
            error: error.message,
            details: error.errors 
        });
    }
};

// Get a specific task
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('assignedTo')
            .populate('project', 'name');

        if (!task) {
            logger.warn(`Task not found: ${req.params.id}`);
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(task);
    } catch (error) {
        logger.error(`Error fetching task: ${error.message}`);
        res.status(500).json({ 
            error: 'Server error',
            details: error.message
        });
    }
};

// Update a task by ID
exports.updateTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;
        
        // Validate status if provided
        if (status && !['To Do', 'In Progress', 'Done'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        const task = await Task.findById(req.params.id);
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Update only allowed fields
        if (title) task.title = title;
        if (description) task.description = description;
        if (status) task.status = status;
        if (priority) task.priority = priority;
        if (dueDate) task.dueDate = dueDate;

        const updatedTask = await task.save();

        // Populate the assignedTo and project fields before sending response
        await updatedTask.populate('assignedTo project');

        res.status(200).json({ 
            message: 'Task updated successfully',
            updatedTask
        });
    } catch (error) {
        logger.error(`Error updating task: ${error.message}`);
        res.status(400).json({ 
            error: 'Update failed',
            details: error.message
        });
    }
};

// Delete a task by ID
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Remove task from project's tasks array
        await Project.findByIdAndUpdate(
            task.project,
            { $pull: { tasks: task._id } },
            { new: true }
        );

        logger.info(`Task deleted: ${task._id}`);
        res.status(200).json({ 
            message: 'Task deleted successfully',
            deletedTask: task
        });
    } catch (error) {
        logger.error(`Error deleting task: ${error.message}`);
        res.status(500).json({ 
            error: 'Deletion failed',
            details: error.message
        });
    }
};