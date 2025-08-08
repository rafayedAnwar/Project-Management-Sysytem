const Review = require('../Models/reviewModel');
const User = require('../Models/userModel');
const Project = require('../Models/projectModel');
const mongoose = require('mongoose');

// Test authentication endpoint
const testAuth = async (req, res) => {
    res.status(200).json({ message: 'Authentication successful', user: req.user });
};

// Submit a review from staff to manager
const submitStaffReview = async (req, res) => {
    const { projectId, managerId, rating, comment } = req.body;
    const staffId = req.user._id; // Get staff ID from authenticated user

    try {
        // Validate project exists if projectId is not 'general'
        if (projectId !== 'general') {
            const project = await Project.findById(projectId);
            if (!project) {
                return res.status(404).json({ error: 'Project not found' });
            }
        }

        // Validate manager exists
        const manager = await User.findById(managerId);
        if (!manager) {
            return res.status(404).json({ error: 'Manager not found' });
        }

        // Create the review
        const review = await Review.create({
            projectId,
            managerId,
            staffId,
            reviewerId: staffId, // Staff is the reviewer
            rating,
            comment,
            reviewType: 'staff' // This is a staff review
        });

        // Update the staff's reviewsGiven array
        await User.findByIdAndUpdate(staffId, {
            $push: {
                reviewsGiven: {
                    projectId,
                    toStaff: managerId,
                    rating,
                    comment
                }
            }
        });

        // Update the manager's reviewsReceived array
        await User.findByIdAndUpdate(managerId, {
            $push: {
                reviewsReceived: {
                    projectId,
                    fromStaff: staffId,
                    rating,
                    comment
                }
            }
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Submit a review from manager to staff
const submitManagerReview = async (req, res) => {
    const { projectId, staffId, rating, comment } = req.body;
    const managerId = req.user._id; // Get manager ID from authenticated user

    try {
        // Validate project exists if projectId is not 'general'
        if (projectId !== 'general') {
            const project = await Project.findById(projectId);
            if (!project) {
                return res.status(404).json({ error: 'Project not found' });
            }
        }

        // Validate staff exists
        const staff = await User.findById(staffId);
        if (!staff) {
            return res.status(404).json({ error: 'Staff member not found' });
        }

        // Create the review
        const review = await Review.create({
            projectId,
            managerId,
            staffId,
            reviewerId: managerId, // Manager is the reviewer
            rating,
            comment,
            reviewType: 'manager' // This is a manager review
        });

        // Update the manager's reviewsGiven array
        await User.findByIdAndUpdate(managerId, {
            $push: {
                reviewsGiven: {
                    projectId,
                    toStaff: staffId,
                    rating,
                    comment
                }
            }
        });

        // Update the staff's reviewsReceived array
        await User.findByIdAndUpdate(staffId, {
            $push: {
                reviewsReceived: {
                    projectId,
                    fromStaff: managerId,
                    rating,
                    comment
                }
            }
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get reviews given by a user
const getReviewsGiven = async (req, res) => {
    const userId = req.user._id; // Get user ID from authenticated user

    try {
        const user = await User.findById(userId).populate('reviewsGiven.toStaff');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user.reviewsGiven);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get reviews received by a user
const getReviewsReceived = async (req, res) => {
    const userId = req.user._id; // Get user ID from authenticated user

    try {
        const user = await User.findById(userId).populate('reviewsReceived.fromStaff');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user.reviewsReceived);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    testAuth,
    submitStaffReview,
    submitManagerReview,
    getReviewsGiven,
    getReviewsReceived
};