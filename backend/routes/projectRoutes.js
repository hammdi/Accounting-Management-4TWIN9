const express = require('express');
const { createProject, getMyProjects, updateProject, deleteProject } = require('../controller/projectController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/addproject', auth, createProject);
router.get('/myprojects', auth, getMyProjects);
router.put('/updateproject/:id', auth, updateProject);
router.delete('/deleteproject/:id', auth, deleteProject);

module.exports = router;
