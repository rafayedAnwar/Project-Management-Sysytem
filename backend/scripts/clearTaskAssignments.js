const mongoose = require('mongoose');
const Task = require('../Models/taskModel');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.DB_LINK)
  .then(() => {
    console.log('Connected to MongoDB');
    clearTaskAssignments();
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });

// Function to clear assignedTo field and set status back to pending for all assigned tasks
async function clearTaskAssignments() {
  try {
    // Update tasks with status 'assigned' to clear assignedTo and reset status to 'pending'
    const result = await Task.updateMany(
      { status: 'assigned' }, // Match only assigned tasks
      { 
        $set: { 
          assignedTo: null,     // Clear assignedTo field
          status: 'pending',   // Reset status to pending
          assignedAt: null     // Clear assignedAt timestamp
        } 
      }
    );

    console.log(`Successfully cleared assignments for ${result.modifiedCount} tasks`);
    mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing task assignments:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}