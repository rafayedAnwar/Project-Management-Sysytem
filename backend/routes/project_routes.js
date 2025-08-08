const express = require('express');
const router = express.Router();
const {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    acceptProject
} = require('../controllers/projectController');

// GET all projects
router.get('/', getProjects);

// GET a single project
router.get('/:id', getProject);

// POST a new project
router.post('/', createProject);

// UPDATE a project
router.patch('/:id', updateProject);

// ACCEPT a project and assign project manager
router.post('/:id/accept', acceptProject);

// DELETE a project
router.delete('/:id', deleteProject);

module.exports = router;