const User = require('../Models/userModel')

// Create a new user
const createUser = async (req, res) => {
    //deciphers incoming request
    const {fullName, email, password, titles, assignedTasks, googleMeetId } = req.body;
    try{
        //creates new user in mongoDB
        const user = await User.create({
            fullName,
            email,
            password,
            titles,
            assignedTasks,
            googleMeetId
        })
        res.status(201).json(user)

    }catch (error) {
        res.status(400).json({error: error.message})
    }
}

// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).sort({createdAt: -1})
        res.status(200).json(users)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// Get a single user
const getUser = async (req, res) => {
    const { id } = req.params
    try {
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).json({error: 'User not found'})
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// Update a user
const updateUser = async (req, res) => {
    const { id } = req.params
    try {
        const user = await User.findByIdAndUpdate(id, req.body, { new: true })
        if (!user) {
            return res.status(404).json({error: 'User not found'})
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// Delete a user
const deleteUser = async (req, res) => {
    const { id } = req.params
    try {
        const user = await User.findByIdAndDelete(id)
        if (!user) {
            return res.status(404).json({error: 'User not found'})
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// Login a user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Find user by email
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Simple password check (in a real app, you'd use bcrypt to compare hashed passwords)
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Create a simple token (in a real app, you'd use JWT)
        const token = user._id.toString();
        
        // Return user data and token
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            titles: user.titles, // Include titles for role-based access control
            token
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Assign a user to a project function has been removed as per requirements

// Get all project managers
const getProjectManagers = async (req, res) => {
    try {
        // Find users with 'Project Manager' title
        const projectManagers = await User.find({ titles: 'Project Manager' }).sort({createdAt: -1});
        res.status(200).json(projectManagers);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

// Get all team members (non-project managers)
const getTeamMembers = async (req, res) => {
    try {
        // Find users without 'Project Manager' title
        const teamMembers = await User.find({ titles: { $ne: 'Project Manager' } }).sort({createdAt: -1});
        res.status(200).json(teamMembers);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

module.exports = {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    loginUser,
    getProjectManagers,
    getTeamMembers
}