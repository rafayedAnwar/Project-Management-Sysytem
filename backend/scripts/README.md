# Database Utility Scripts

This directory contains utility scripts for managing, inspecting, and cleaning up the database.

## Available Scripts

### 1. Check User Data (checkUserData.js)

#### Overview
This script retrieves and displays sample user data from the database - one non-manager user and one project manager user. It's useful for inspecting the current state of user data in the database.

#### How to Run

1. Make sure your MongoDB connection is properly configured in your `.env` file
2. Navigate to the backend directory
3. Run the script using Node.js:

```bash
node scripts/checkUserData.js
```

#### Expected Output
The script will output:
- Confirmation of MongoDB connection
- Complete data for a sample non-manager user
- Complete data for a sample project manager user
- Confirmation of MongoDB connection closure

#### Notes
- This script is read-only and does not modify any data
- It's useful for debugging and verifying the structure of user documents

### 2. Clear User Assignments (clearUserAssignments.js)

#### Overview
This script clears all `project_assigned` and `assignedTasks` values for non-manager users in the database. It's useful for resetting user assignments when needed.

#### How to Run

1. Make sure your MongoDB connection is properly configured in your `.env` file
2. Navigate to the backend directory
3. Run the script using Node.js:

```bash
node scripts/clearUserAssignments.js
```

#### Expected Output
The script will output:
- Confirmation of MongoDB connection
- Number of users whose assignments were cleared
- Confirmation of MongoDB connection closure

#### Notes
- This script only affects non-manager users (users without the 'Project Manager' title)
- Both `project_assigned` and `assignedTasks` arrays will be set to empty arrays

### 3. Clear Task Assignments (clearTaskAssignments.js)

#### Overview
This script clears the `assignedTo` field for all tasks with status 'assigned' and resets their status to 'pending'. It's useful for clearing task assignments without affecting user data.

#### How to Run

1. Make sure your MongoDB connection is properly configured in your `.env` file
2. Navigate to the backend directory
3. Run the script using Node.js:

```bash
node scripts/clearTaskAssignments.js
```

#### Expected Output
The script will output:
- Confirmation of MongoDB connection
- Number of tasks whose assignments were cleared
- Confirmation of MongoDB connection closure

#### Notes
- This script only affects tasks with status 'assigned'
- The `assignedTo` field will be set to null
- The `status` field will be reset to 'pending'
- The `assignedAt` field will be set to null