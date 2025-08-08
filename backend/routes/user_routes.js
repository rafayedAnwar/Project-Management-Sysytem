const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const { 
    createUser, 
    getUsers, 
    getUser, 
    updateUser, 
    deleteUser,
    loginUser,
    getProjectManagers,
    getTeamMembers
} = require('../controllers/userController')

// LOGIN a user (public route)
router.post('/login', loginUser)

// GET all project managers (protected route)
router.get('/project-managers', authMiddleware, getProjectManagers)

// GET all team members (non-project managers) (protected route)
router.get('/team-members', authMiddleware, getTeamMembers)

// GET all users (protected route)
router.get('/', authMiddleware, getUsers)

// POST a new user
router.post('/', createUser)

// GET a single user (protected route)
router.get('/:id', authMiddleware, getUser)

// DELETE a user (protected route)
router.delete('/:id', authMiddleware, deleteUser)

// UPDATE a user (protected route)
router.patch('/:id', authMiddleware, updateUser)

// ASSIGN a user to a project route has been removed as per requirements

module.exports = router