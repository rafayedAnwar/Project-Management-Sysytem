const mongoose = require('mongoose');
const User = require('../Models/userModel');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.DB_LINK)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Find a non-manager user
    const nonManager = await User.findOne({ titles: { $ne: 'Project Manager' } });
    console.log('\nNon-manager user data:');
    console.log(nonManager);
    
    // Find a manager user
    const manager = await User.findOne({ titles: 'Project Manager' });
    console.log('\nProject Manager user data:');
    console.log(manager);
    
    mongoose.connection.close();
    console.log('\nMongoDB connection closed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });