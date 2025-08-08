import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { submitStaffReview, getReviewsGiven, getReviewsReceived } from '../services/reviewApi';
import { getProjects, getUsers } from '../services/api';
import '../styles/Reviews.css';

const API_BASE_URL = 'http://localhost:4000/api';

const StaffReview = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('submit');
  const [projectManagers, setProjectManagers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [reviewsGiven, setReviewsGiven] = useState([]);
  const [reviewsReceived, setReviewsReceived] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Form state
  const [selectedManager, setSelectedManager] = useState('');
  const [projectId, setProjectId] = useState('general');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  
  useEffect(() => {
    // Check if user is staff (not a project manager)
    const checkUserRole = () => {
      try {
        const userData = localStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          if (user && user.titles && user.titles.includes('Project Manager')) {
            // Redirect project managers to their review page
            navigate('/manager-review');
          }
        }
      } catch (error) {
        console.error('Error checking user role:', error);
      }
    };
    
    checkUserRole();
    
    // Fetch project managers from the backend
    const fetchProjectManagers = async () => {
      try {
        console.log('Fetching project managers...');
        console.log('Auth token:', localStorage.getItem('authToken'));
        
        const response = await fetch(`${API_BASE_URL}/users/project-managers`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        
        console.log('Response status:', response.status);
        
        const data = await response.json();
        console.log('Response data:', data);
        
        if (!response.ok) {
          throw new Error(data.message || data.error || 'Failed to fetch project managers');
        }
        
        setProjectManagers(data);
      } catch (err) {
        setError('Failed to load project managers');
        console.error('Project managers fetch error:', err);
      }
    };
    
    // Fetch projects from the backend
    const fetchProjects = async () => {
      try {
        const projectsData = await getProjects();
        setProjects(projectsData);
      } catch (err) {
        setError('Failed to load projects');
        console.error(err);
      }
    };
    
    const fetchReviews = async () => {
      try {
        setLoading(true);
        
        // Fetch reviews given by the user
        const givenData = await getReviewsGiven();
        setReviewsGiven(givenData);
        
        // Fetch reviews received by the user
        const receivedData = await getReviewsReceived();
        setReviewsReceived(receivedData);
      } catch (err) {
        setError('Failed to load reviews');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectManagers();
    fetchProjects();
    fetchReviews();
  }, [navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedManager) {
      setError('Please select a project manager');
      return;
    }
    
    if (rating === 0) {
      setError('Please provide a rating');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const reviewData = {
        managerId: selectedManager,
        projectId,
        rating,
        comment
      };
      
      await submitStaffReview(reviewData);
      
      // Reset form
      setSelectedManager('');
      setProjectId('general');
      setRating(0);
      setComment('');
      
      setSuccess('Review submitted successfully!');
      
      // Refresh reviews
      const givenData = await getReviewsGiven();
      setReviewsGiven(givenData);
    } catch (err) {
      setError(err.message || 'Failed to submit review');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleStarClick = (value) => {
    setRating(value);
  };
  
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= rating ? 'filled' : ''}`}
          onClick={() => handleStarClick(i)}
        >
          ★
        </span>
      );
    }
    return stars;
  };
  
  const renderSubmitTab = () => (
    <div className="review-card">
      <h2>Submit Review for Project Manager</h2>
      <form className="review-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="manager">Select Project Manager</label>
          <select
            id="manager"
            value={selectedManager}
            onChange={(e) => setSelectedManager(e.target.value)}
            required
          >
            <option value="">-- Select a Project Manager --</option>
            {projectManagers.map((manager) => (
              <option key={manager._id} value={manager._id}>
                {manager.fullName}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="project">Project (Optional)</label>
          <select
            id="project"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            <option value="general">General Review (Not Project Specific)</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Rating</label>
          <div className="star-rating">
            <div className="stars">{renderStars()}</div>
            <span className="rating-value">{rating > 0 ? rating : ''}</span>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="comment">Comments</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience working with this project manager..."
          ></textarea>
        </div>
        
        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </div>
  );
  
  const renderGivenTab = () => (
    <div className="review-card">
      <h2>Reviews You've Given</h2>
      {loading ? (
        <p>Loading reviews...</p>
      ) : reviewsGiven.length > 0 ? (
        reviewsGiven.map((review, index) => (
          <div key={index} className="review-item">
            <h3>Review for {review.managerName}</h3>
            <p><strong>Project:</strong> {review.projectId === 'general' ? 'General Review' : review.projectName}</p>
            <p><strong>Rating:</strong> {review.rating}/5</p>
            <p><strong>Comment:</strong> {review.comment}</p>
            <p><strong>Submitted:</strong> {new Date(review.submittedAt).toLocaleDateString()}</p>
          </div>
        ))
      ) : (
        <p>You haven't submitted any reviews yet.</p>
      )}
    </div>
  );
  
  const renderReceivedTab = () => (
    <div className="review-card">
      <h2>Reviews You've Received</h2>
      {loading ? (
        <p>Loading reviews...</p>
      ) : reviewsReceived.length > 0 ? (
        reviewsReceived.map((review, index) => (
          <div key={index} className="review-item">
            <h3>Review from {review.managerName}</h3>
            <p><strong>Project:</strong> {review.projectId === 'general' ? 'General Review' : review.projectName}</p>
            <p><strong>Rating:</strong> {review.rating}/5</p>
            <p><strong>Comment:</strong> {review.comment}</p>
            <p><strong>Submitted:</strong> {new Date(review.submittedAt).toLocaleDateString()}</p>
          </div>
        ))
      ) : (
        <p>You haven't received any reviews yet.</p>
      )}
    </div>
  );
  
  return (
    <div className="review-container">
      <Navbar />
      <div className="review-content">
        <div className="review-header">
          <h1>Staff Review Portal</h1>
          <p>Submit feedback for project managers or view your reviews</p>
        </div>
        
        <div className="review-tabs">
          <button
            className={`tab-button ${activeTab === 'submit' ? 'active' : ''}`}
            onClick={() => setActiveTab('submit')}
          >
            Submit Review
          </button>
          <button
            className={`tab-button ${activeTab === 'given' ? 'active' : ''}`}
            onClick={() => setActiveTab('given')}
          >
            Reviews Given
          </button>
          <button
            className={`tab-button ${activeTab === 'received' ? 'active' : ''}`}
            onClick={() => setActiveTab('received')}
          >
            Reviews Received
          </button>
        </div>
        
        {activeTab === 'submit' && renderSubmitTab()}
        {activeTab === 'given' && renderGivenTab()}
        {activeTab === 'received' && renderReceivedTab()}
      </div>
    </div>
  );
};

export default StaffReview;