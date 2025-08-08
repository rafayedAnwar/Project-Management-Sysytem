// API service for review management

const API_BASE_URL = 'http://localhost:4000/api';

// Function to submit a staff review (staff reviewing manager)
export const submitStaffReview = async (reviewData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/staff`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(reviewData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to submit staff review');
    }

    return data;
  } catch (error) {
    console.error('Submit staff review error:', error);
    throw error;
  }
};

// Function to submit a manager review (manager reviewing staff)
export const submitManagerReview = async (reviewData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/manager`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(reviewData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to submit manager review');
    }

    return data;
  } catch (error) {
    console.error('Submit manager review error:', error);
    throw error;
  }
};

// Function to get reviews given by the current user
export const getReviewsGiven = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/given`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch reviews given');
    }

    return data;
  } catch (error) {
    console.error('Get reviews given error:', error);
    throw error;
  }
};

// Function to get reviews received by the current user
export const getReviewsReceived = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/received`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch reviews received');
    }

    return data;
  } catch (error) {
    console.error('Get reviews received error:', error);
    throw error;
  }
};