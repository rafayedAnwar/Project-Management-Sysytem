const Task = require('../Models/taskModel');
const Project = require('../Models/projectModel');
const User = require('../Models/userModel');

// Get all tasks
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({}).sort({createdAt: -1});
        res.status(200).json(tasks);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

// Get tasks by project ID
const getTasksByProject = async (req, res) => {
    const { projectId } = req.params;
    
    try {
        const tasks = await Task.find({ project: projectId }).sort({createdAt: -1});
        res.status(200).json(tasks);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

// Get a single task
const getTask = async (req, res) => {
    const { id } = req.params;
    
    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({error: 'Task not found'});
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

// Create a new task
const createTask = async (req, res) => {
    const { title, description, project, deadline, priority, status } = req.body;
    
    try {
        // Check if project exists
        const projectExists = await Project.findById(project);
        if (!projectExists) {
            return res.status(404).json({error: 'Project not found'});
        }
        
        // Create task
        const task = await Task.create({
            title,
            description,
            project,
            deadline,
            priority: priority || 'Medium',
            status: status || 'pending'
        });
        
        // Add task to project's tasks array
        await Project.findByIdAndUpdate(project, {
            $push: { tasks: task._id }
        });
        
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

// Update a task
const updateTask = async (req, res) => {
    const { id } = req.params;
    
    try {
        const task = await Task.findByIdAndUpdate(id, req.body, { new: true });
        if (!task) {
            return res.status(404).json({error: 'Task not found'});
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

// Assign a task to a user
const assignTask = async (req, res) => {
    const { id } = req.params;
    const { assignedTo, priority, allocatedTime } = req.body;
    
    try {
        // Check if task exists
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({error: 'Task not found'});
        }
        
        // Check if user exists
        const user = await User.findById(assignedTo);
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }
        
        // Update task
        const updatedTask = await Task.findByIdAndUpdate(id, {
            assignedTo,
            priority,
            allocatedTime,
            status: 'assigned',
            assignedAt: new Date()
        }, { new: true });
        
        // Add task to user's assignedTasks array
        await User.findByIdAndUpdate(assignedTo, {
            $push: { assignedTasks: id }
        });
        
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

// Delete a task
const deleteTask = async (req, res) => {
    const { id } = req.params;
    
    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({error: 'Task not found'});
        }
        
        // Remove task from project's tasks array
        await Project.findByIdAndUpdate(task.project, {
            $pull: { tasks: id }
        });
        
        // If task is assigned, remove from user's assignedTasks array
        if (task.assignedTo) {
            await User.findByIdAndUpdate(task.assignedTo, {
                $pull: { assignedTasks: id }
            });
        }
        
        // Delete task
        await Task.findByIdAndDelete(id);
        
        res.status(200).json({message: 'Task deleted successfully'});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

// Create multiple random tasks for a project (for testing)
const createRandomTasks = async (req, res) => {
    const { projectId } = req.params;
    const { count = 5 } = req.body;
    
    try {
        // Check if project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({error: 'Project not found'});
        }
        
        const taskTypes = [
            { title: 'Database Schema Design', description: 'Create MongoDB schema for project data models' },
            { title: 'API Development', description: 'Develop RESTful API endpoints for the application' },
            { title: 'Frontend Components', description: 'Create reusable UI components for the frontend' },
            { title: 'Authentication System', description: 'Implement secure user authentication and authorization' },
            { title: 'Data Visualization', description: 'Create charts and graphs for data visualization' },
            { title: 'Testing Framework', description: 'Set up testing framework and write unit tests' },
            { title: 'Documentation', description: 'Create comprehensive documentation for the project' },
            { title: 'Deployment Setup', description: 'Configure deployment pipeline and server setup' },
            { title: 'Performance Optimization', description: 'Optimize application performance and loading times' },
            { title: 'Security Audit', description: 'Conduct security audit and implement security measures' }
        ];
        
        const priorities = ['High', 'Medium', 'Low'];
        
        // Create random tasks
        const tasks = [];
        for (let i = 0; i < Math.min(count, taskTypes.length); i++) {
            // Get random task type
            const randomIndex = Math.floor(Math.random() * taskTypes.length);
            const taskType = taskTypes.splice(randomIndex, 1)[0];
            
            // Generate random deadline (between now and 30 days from now)
            const now = new Date();
            const futureDate = new Date();
            futureDate.setDate(now.getDate() + Math.floor(Math.random() * 30) + 1);
            
            // Get random priority
            const priority = priorities[Math.floor(Math.random() * priorities.length)];
            
            // Create task
            const task = await Task.create({
                title: taskType.title,
                description: taskType.description,
                project: projectId,
                deadline: futureDate,
                priority
            });
            
            tasks.push(task);
        }
        
        // Add tasks to project's tasks array
        await Project.findByIdAndUpdate(projectId, {
            $push: { tasks: { $each: tasks.map(task => task._id) } }
        });
        
        res.status(201).json(tasks);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

// Get tasks assigned to a user
const getTasksByUser = async (req, res) => {
    const { userId } = req.params;
    
    try {
        console.log(`Backend: Getting tasks for user ID: ${userId}`);
        
        // Find the user to get their assignedTasks array
        const user = await User.findById(userId);
        if (!user) {
            console.log(`Backend: User not found with ID: ${userId}`);
            return res.status(404).json({error: 'User not found'});
        }
        
        console.log(`Backend: User found: ${user.fullName}, assigned tasks count: ${user.assignedTasks.length}`);
        
        // Populate the assignedTasks
        const populatedUser = await User.findById(userId).populate('assignedTasks');
        
        // Return the populated assignedTasks
        console.log(`Backend: Returning ${populatedUser.assignedTasks.length} tasks`);
        res.status(200).json(populatedUser.assignedTasks);
    } catch (error) {
        console.error(`Backend: Error in getTasksByUser: ${error.message}`);
        res.status(400).json({error: error.message});
    }
};

module.exports = {
    getTasks,
    getTasksByProject,
    getTask,
    createTask,
    updateTask,
    assignTask,
    deleteTask,
    createRandomTasks,
    getTasksByUser
};