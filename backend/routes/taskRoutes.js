const express = require('express');
const {
    createTask,
    getTasksByProject,
    getTaskById,
    updateTask,
    deleteTask
} = require('../controller/taskController');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a new task
router.post('/create', auth, createTask);

// Get tasks for a specific project
router.get('/project/:projectId', auth, getTasksByProject);

// Get a task by ID
router.get('/:id', auth, getTaskById);

// Update a task by ID
router.put('/:id', auth, updateTask);

// Delete a task by ID
router.delete('/:id', auth, deleteTask);

module.exports = router;
