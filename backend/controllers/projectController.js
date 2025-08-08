const Project = require('../Models/projectModel');

// Get all projects
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({}).sort({createdAt: -1});
        res.status(200).json(projects);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

// Get a single project
const getProject = async (req, res) => {
    const { id } = req.params;
    try {
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({error: 'Project not found'});
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

// Create a new project
const createProject = async (req, res) => {
    const { title, company_title, aproval_stat, status, duration, budget, team_size, progress, tasks } = req.body;
    try {
        const project = await Project.create({
            title,
            company_title,
            aproval_stat,
            status,
            duration,
            budget,
            team_size,
            progress: progress || 0,
            tasks: tasks || []
        });
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

// Update a project
const updateProject = async (req, res) => {
    const { id } = req.params;
    try {
        const project = await Project.findOneAndUpdate({_id: id}, req.body, {new: true});
        if (!project) {
            return res.status(404).json({error: 'Project not found'});
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

// Accept a project and assign a project manager
const acceptProject = async (req, res) => {
    const { id } = req.params;
    const { projectManagerId } = req.body;
    
    try {
        // Verify the project exists
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({error: 'Project not found'});
        }
        
        // Update project status and assign project manager
        const updatedProject = await Project.findByIdAndUpdate(
            id,
            {
                status: 'accepted',
                aproval_stat: true,
                projectManager: projectManagerId
            },
            {new: true}
        );
        
        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

// Delete a project
const deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        const project = await Project.findOneAndDelete({_id: id});
        if (!project) {
            return res.status(404).json({error: 'Project not found'});
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

module.exports = {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    acceptProject
};