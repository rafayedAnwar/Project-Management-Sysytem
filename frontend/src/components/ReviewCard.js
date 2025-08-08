import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

const ReviewCard = () => {
  // Check if user is a project manager
  const isProjectManager = () => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        return user && user.titles && user.titles.includes('Project Manager');
      }
      return false;
    } catch (error) {
      console.error('Error checking user role:', error);
      return false;
    }
  };

  return (
    <div className="dashboard-card review-card">
      <h2>Performance Reviews</h2>
      <div className="card-content">
        <div className="review-description">
          {isProjectManager() ? (
            <p>Submit performance reviews for your team members or view feedback you've received.</p>
          ) : (
            <p>Submit feedback for your project managers or view reviews you've received.</p>
          )}
        </div>
        <div className="review-actions">
          {isProjectManager() ? (
            <Link to="/manager-review" className="review-button">
              Manager Review Portal
            </Link>
          ) : (
            <Link to="/staff-review" className="review-button">
              Staff Review Portal
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;