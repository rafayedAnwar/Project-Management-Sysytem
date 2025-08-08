const express = require('express');
const router = express.Router();
const {
    getTasks,
    getTasksByProject,
    getTask,
    createTask,
    updateTask,
    assignTask,
    deleteTask,
    createRandomTasks,
    getTasksByUser
} = require('../controllers/taskController');

// IMPORTANT: Route order matters! More specific routes must come before generic ones.
// Express matches routes in the order they are defined.

// GET tasks assigned to a user - MUST be before other routes with path parameters
router.get('/user/:userId', getTasksByUser);

// GET tasks by project ID
router.get('/project/:projectId', getTasksByProject);

// GET all tasks
router.get('/', getTasks);

// GET a single task - must be after more specific routes
// This is a generic route that will match any ID, so it must come last
router.get('/:id', getTask);

// POST a new task
router.post('/', createTask);

// UPDATE a task
router.patch('/:id', updateTask);

// ASSIGN a task to a user
router.patch('/:id/assign', assignTask);

// DELETE a task
router.delete('/:id', deleteTask);

// CREATE random tasks for a project (for testing)
router.post('/random/:projectId', createRandomTasks);

module.exports = router;