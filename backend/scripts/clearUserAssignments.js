const mongoose = require('mongoose');
const User = require('../Models/userModel');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.DB_LINK)
  .then(() => {
    console.log('Connected to MongoDB');
    clearUserAssignments();
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });

// Function to clear project_assigned and assignedTasks for non-manager users only
async function clearUserAssignments() {
  try {
    // Update only non-manager users to clear project_assigned and assignedTasks
    const result = await User.updateMany(
      { titles: { $ne: 'Project Manager' } }, // Match only non-manager users
      { 
        $set: { 
          project_assigned: [], // Clear project_assigned array
          assignedTasks: []    // Clear assignedTasks array
        } 
      }
    );

    console.log(`Successfully cleared assignments for ${result.modifiedCount} users`);
    mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing user assignments:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}