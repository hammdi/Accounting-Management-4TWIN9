// routes/projectRoutes.js
const express = require('express');
const {
    createProject,
    getMyProjects,
    getAllProjects,
    updateProject,
    deleteProject
} = require('../controller/projectController');
const auth = require('../middleware/auth');

const router = express.Router();

// Corrected project routes
router.post('/', auth, createProject);
router.get('/myprojects', auth, getMyProjects);
router.get('/', auth, getAllProjects);
router.put('/:id', auth, updateProject);
router.delete('/:id', auth, deleteProject);

module.exports = router;