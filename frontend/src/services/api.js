// API service for user authentication and project management

const API_BASE_URL = 'http://localhost:4000/api';

// Function to handle login requests
export const loginUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    console.log('Login response:', data);
    
    // Store the token and user data in localStorage for future authenticated requests
    if (data.token) {
      console.log('Storing auth token:', data.token);
      localStorage.setItem('authToken', data.token);
      
      // Make sure we have valid user data before storing it
      if (data._id && data.fullName && data.email) {
        const userData = {
          _id: data._id,
          fullName: data.fullName,
          email: data.email,
          titles: data.titles || [] // Include titles for role-based access control
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        console.log('Stored user data:', userData);
      }
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Function to handle logout
export const logoutUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
};

// Function to check if user is authenticated
export const isAuthenticated = () => {
  try {
    return localStorage.getItem('authToken') !== null;
  } catch (error) {
    console.error('Authentication check error:', error);
    return false;
  }
};

// Function to get all projects
export const getProjects = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch projects');
    }

    return data;
  } catch (error) {
    console.error('Get projects error:', error);
    throw error;
  }
};

// Function to get a single project
export const getProject = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch project');
    }

    return data;
  } catch (error) {
    console.error('Get project error:', error);
    throw error;
  }
};

// Function to update project status
export const updateProjectStatus = async (id, status) => {
  try {
    // Update the status and set initial progress if accepting
    const updateData = { 
      status,
      // Only set progress if it's not already set in the database
      // The backend should handle this properly
    };
      
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(updateData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update project status');
    }

    return data;
  } catch (error) {
    console.error('Update project status error:', error);
    throw error;
  }
};

// Function to get all users
export const getUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch users');
    }

    return data;
  } catch (error) {
    console.error('Get users error:', error);
    throw error;
  }
};

// Function to get tasks for a project
export const getTasksByProject = async (projectId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/project/${projectId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch tasks');
    }

    return data;
  } catch (error) {
    console.error('Get tasks error:', error);
    throw error;
  }
};

// Function to create a task
export const createTask = async (taskData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(taskData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create task');
    }

    return data;
  } catch (error) {
    console.error('Create task error:', error);
    throw error;
  }
};

// Function to create random tasks for a project
export const createRandomTasks = async (projectId, count = 5) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/random/${projectId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ count })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create random tasks');
    }

    return data;
  } catch (error) {
    console.error('Create random tasks error:', error);
    throw error;
  }
};

// Function to assign a task to a team member
export const assignTask = async (taskId, assignmentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/assign`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(assignmentData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to assign task');
    }

    return data;
  } catch (error) {
    console.error('Assign task error:', error);
    throw error;
  }
};

// Function to update a project with team members and project manager
export const updateProjectTeam = async (projectId, teamData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(teamData)
    });
    
    // Check if response is HTML instead of JSON
    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType);
    
    if (contentType && contentType.includes('text/html')) {
      const htmlText = await response.text();
      console.error('Received HTML instead of JSON:', htmlText.substring(0, 100));
      throw new Error('Received HTML instead of JSON. API endpoint may be incorrect.');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update project team');
    }

    return data;
  } catch (error) {
    console.error('Update project team error:', error);
    throw error;
  }
};

// Function to assign a user to a project
export const assignUserToProject = async (userId, projectId) => {
  try {
    // First get the current user data
    const userResponse = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    // Check if response is HTML instead of JSON
    const contentType = userResponse.headers.get('content-type');
    console.log('Content-Type:', contentType);
    
    if (contentType && contentType.includes('text/html')) {
      const htmlText = await userResponse.text();
      console.error('Received HTML instead of JSON:', htmlText.substring(0, 100));
      throw new Error('Received HTML instead of JSON. API endpoint may be incorrect.');
    }

    const userData = await userResponse.json();
    
    if (!userResponse.ok) {
      throw new Error(userData.message || 'Failed to fetch user data');
    }
    
    // Prepare the updated project_assigned array
    let projectAssigned = userData.project_assigned || [];
    
    // Convert to array if it's not already
    if (!Array.isArray(projectAssigned)) {
      projectAssigned = [projectAssigned];
    }
    
    // Add the new project ID if it's not already in the array
    if (!projectAssigned.includes(projectId)) {
      projectAssigned.push(projectId);
    }
    
    // Update the user with the new project_assigned array
    const updateResponse = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ project_assigned: projectAssigned })
    });
    
    // Check if update response is HTML instead of JSON
    const updateContentType = updateResponse.headers.get('content-type');
    if (updateContentType && updateContentType.includes('text/html')) {
      const htmlText = await updateResponse.text();
      console.error('Received HTML instead of JSON for update:', htmlText.substring(0, 100));
      throw new Error('Received HTML instead of JSON when updating user. API endpoint may be incorrect.');
    }

    const updateData = await updateResponse.json();

    if (!updateResponse.ok) {
      throw new Error(updateData.message || 'Failed to assign user to project');
    }

    return updateData;
  } catch (error) {
    console.error('Assign user to project error:', error);
    throw error;
  }
};

// Function to get tasks assigned to a user
export const getTasksByUser = async (userId) => {
  try {
    console.log(`Fetching tasks for user: ${userId}`);
    // Ensure we're using the correct endpoint format
    const url = `${API_BASE_URL}/tasks/user/${userId}`;
    console.log(`API URL: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    // Check if response is HTML instead of JSON
    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType);
    
    if (contentType && contentType.includes('text/html')) {
      const htmlText = await response.text();
      console.error('Received HTML instead of JSON:', htmlText.substring(0, 100));
      throw new Error('Received HTML instead of JSON. API endpoint may be incorrect.');
    }

    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch assigned tasks');
    }

    return data;
  } catch (error) {
    console.error('Get assigned tasks error:', error);
    throw error;
  }
};