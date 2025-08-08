import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProjects, updateProjectStatus } from '../services/api'
import '../styles/Dashboard.css'
const PendingRequestsBox = () => {
  const navigate = useNavigate()
  const [pendingRequests, setPendingRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasAcceptedProject, setHasAcceptedProject] = useState(false)
  
  // Fetch projects from the API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true)
        const projects = await getProjects()
        // Format the projects data to match the component's expected structure
        const formattedProjects = projects.map(project => ({
          id: project._id,
          title: project.title,
          status: project.status || 'pending',
          date: new Date(project.date || project.createdAt).toISOString().split('T')[0],
          company: project.company_title,
          duration: project.duration,
          budget: project.budget,
          team_size: project.team_size
        }))
        setPendingRequests(formattedProjects)
        
        // Check if any project is already accepted
        const hasAccepted = formattedProjects.some(project => project.status === 'accepted')
        setHasAcceptedProject(hasAccepted)
        
        setError(null)
      } catch (err) {
        console.error('Error fetching projects:', err)
        setError('Failed to load projects. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProjects()
  }, [])
  
  // Handler for proceeding to project details
  const handleProceed = async (requestId) => {
    try {
      // Navigate to project details page without changing status
      // The status will be changed when the team is formed
      navigate(`/project/${requestId}`);
    } catch (err) {
      console.error('Error navigating to project:', err)
      alert('Failed to proceed to project details. Please try again.')
    }
  }
  
  // Handler for rejecting a request
  const handleReject = async (requestId) => {
    try {
      // Call API to update the project status
      await updateProjectStatus(requestId, 'rejected')
      // Update local state
      setPendingRequests(pendingRequests.map(request => 
        request.id === requestId ? { ...request, status: 'rejected' } : request
      ))
    } catch (err) {
      console.error('Error updating project status:', err)
      alert('Failed to update project status. Please try again.')
    }
  }
  // If any project has been accepted, don't render the component
  if (hasAcceptedProject) {
    return null;
  }
  
  return (
    <div className="dashboard-card pending-requests">
      <h2>Project Proposals: </h2>
      <div className="card-content">
        {isLoading ? (
          <p className="loading-data">Loading projects...</p>
        ) : error ? (
          <p className="error-data">{error}</p>
        ) : pendingRequests.length > 0 ? (
          <ul className="request-list">
            {pendingRequests.map(request => (
              <li key={request.id} className="request-item">
                <div className="request-title">{request.title}</div>
                <div className="request-company">{request.company}</div>
                <div className="request-budget">Budget: ${request.budget}</div>
                <div className="request-duration">Duration: {request.duration} months</div>
                <div className="request-date">{request.date}</div>
                <div className={`request-status status-${request.status}`}>{request.status}</div>
                {request.status === 'pending' && (
                  <div className="request-actions">
                    <button 
                      className="action-btn accept-btn" 
                      onClick={() => handleProceed(request.id)}
                    >
                      Proceed
                    </button>
                    <button 
                      className="action-btn reject-btn" 
                      onClick={() => handleReject(request.id)}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-data">No pending requests</p>
        )}
      </div>
    </div>
  )
}

export default PendingRequestsBox