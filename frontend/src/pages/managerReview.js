import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { submitManagerReview, getReviewsGiven, getReviewsReceived } from '../services/reviewApi';
import { getProjects, getUsers } from '../services/api';
import '../styles/Reviews.css';

const API_BASE_URL = 'http://localhost:4000/api';

const ManagerReview = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('submit');
  const [teamMembers, setTeamMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [reviewsGiven, setReviewsGiven] = useState([]);
  const [reviewsReceived, setReviewsReceived] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Form state
  const [selectedStaff, setSelectedStaff] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [acceptedProject, setAcceptedProject] = useState(null);
  
  useEffect(() => {
    // Check if user is a project manager
    const checkUserRole = () => {
      try {
        const userData = localStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          if (!user || !user.titles || !user.titles.includes('Project Manager')) {
            // Redirect non-managers to staff review page
            navigate('/staff-review');
          }
        }
      } catch (error) {
        console.error('Error checking user role:', error);
      }
    };
    
    checkUserRole();
    
    // Fetch team members from the backend - only get members of accepted projects
    const fetchTeamMembers = async () => {
      try {
        console.log('Fetching team members...');
        console.log('Auth token:', localStorage.getItem('authToken'));
        
        const response = await fetch(`${API_BASE_URL}/users/team-members`, {
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
          throw new Error(data.message || data.error || 'Failed to fetch team members');
        }
        
        // We'll filter team members in the render function based on the accepted project
        setTeamMembers(data);
      } catch (err) {
        setError('Failed to load team members');
        console.error('Team members fetch error:', err);
      }
    };
    
    // Fetch projects from the backend - only get accepted projects
    const fetchProjects = async () => {
      try {
        const projectsData = await getProjects();
        const acceptedProjects = projectsData.filter(project => project.status === 'accepted');
        setProjects(acceptedProjects);
        
        // Set the first accepted project as the current project
        if (acceptedProjects.length > 0) {
          setAcceptedProject(acceptedProjects[0]);
        }
      } catch (err) {
        setError('Failed to load projects');
        console.error(err);
      }
    };
    
    const fetchReviews = async () => {
      try {
        setLoading(true);
        
        // Fetch reviews given by the manager
        const givenData = await getReviewsGiven();
        setReviewsGiven(givenData);
        
        // Fetch reviews received by the manager
        const receivedData = await getReviewsReceived();
        setReviewsReceived(receivedData);
      } catch (err) {
        setError('Failed to load reviews');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeamMembers();
    fetchProjects();
    fetchReviews();
  }, [navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedStaff) {
      setError('Please select a team member');
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
        staffId: selectedStaff,
        projectId: acceptedProject ? acceptedProject._id : 'general',
        rating,
        comment
      };
      
      await submitManagerReview(reviewData);
      
      // Reset form
      setSelectedStaff('');
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
      <h2>Submit Review for Team Member</h2>
      <form className="review-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="staff">Select Team Member</label>
          <select
            id="staff"
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            required
          >
            <option value="">-- Select a Team Member --</option>
            {acceptedProject && teamMembers
              .filter(member => member.project_assigned && member.project_assigned.includes(acceptedProject._id))
              .map((member) => (
                <option key={member._id} value={member._id}>
                  {member.fullName}
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
            placeholder="Provide feedback on this team member's performance..."
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
  
  const renderBatchReviewSection = () => {
    // Filter team members to only show those assigned to the accepted project
    const filteredMembers = acceptedProject 
      ? teamMembers.filter(member => 
          member.project_assigned && member.project_assigned.includes(acceptedProject._id)
        )
      : [];
      
    return (
      <div className="batch-review">
        <h2>Batch Review Team Members</h2>
        {acceptedProject ? (
          <div className="team-members-list">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <div key={member._id} className="team-member-card">
                  <div className="member-header">
                    <div className="member-avatar">
                      {member.fullName.charAt(0)}
                    </div>
                    <div className="member-info">
                      <h3>{member.fullName}</h3>
                      <p>{member.email}</p>
                    </div>
                  </div>
                  <button
                    className="review-button"
                    onClick={() => {
                      setSelectedStaff(member._id);
                      setActiveTab('submit');
                      // Scroll to the submit form
                      document.querySelector('.review-form').scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Review This Member
                  </button>
                </div>
              ))
            ) : (
              <p>No team members assigned to this project.</p>
            )}
          </div>
        ) : (
          <p>No accepted project available.</p>
        )}
      </div>
    );
  };
  
  const renderGivenTab = () => (
    <div className="review-card">
      <h2>Reviews You've Given</h2>
      {loading ? (
        <p>Loading reviews...</p>
      ) : reviewsGiven.length > 0 ? (
        reviewsGiven.map((review, index) => (
          <div key={index} className="review-item">
            <h3>Review for {review.staffName}</h3>
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
            <h3>Review from {review.staffName}</h3>
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
    <div className="review-container manager-review-container">
      <Navbar />
      <div className="review-content">
        <div className="review-header">
          <h1>Manager Review Portal</h1>
          {acceptedProject && (
            <h2>Current Project: {acceptedProject.title}</h2>
          )}
          <p>Submit performance reviews for your team members or view feedback you've received</p>
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
        
        {activeTab === 'submit' && (
          <>
            {renderSubmitTab()}
            {renderBatchReviewSection()}
          </>
        )}
        {activeTab === 'given' && renderGivenTab()}
        {activeTab === 'received' && renderReceivedTab()}
      </div>
    </div>
  );
};

export default ManagerReview;