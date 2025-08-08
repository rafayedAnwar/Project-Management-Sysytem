import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProjects } from '../services/api'
import '../styles/Dashboard.css'
const ActiveProjectsCard = () => {
  const navigate = useNavigate()
  const [activeProjects, setActiveProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isProjectManager, setIsProjectManager] = useState(false)
  
  // Check if user is a project manager
  useEffect(() => {
    try {
      const userData = localStorage.getItem('userData')
      if (userData) {
        const user = JSON.parse(userData)
        // Check if user has Project Manager title
        if (user && user.titles && user.titles.includes('Project Manager')) {
          setIsProjectManager(true)
        }
      }
    } catch (error) {
      console.error('Error parsing user data:', error)
    }
  }, [])

  // Fetch projects from the API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true)
        const projects = await getProjects()
        // Filter for accepted projects
        const acceptedProjects = projects.filter(project => project.status === 'accepted')
        
        // Format the projects data
        const formattedProjects = acceptedProjects.map(project => ({
          id: project._id,
          name: project.title,
          company: project.company_title,
          budget: project.budget,
          duration: project.duration,
          // Use progress from database without default value
          progress: project.progress || 0
        }))
        
        setActiveProjects(formattedProjects)
        setError(null)
      } catch (err) {
        console.error('Error fetching projects:', err)
        setError('Failed to load active projects. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProjects()
  }, [])
  return (
    <div className="dashboard-card active-projects">
      <h2>Active Projects</h2>
      <div className="card-content">
        {isLoading ? (
          <p className="loading-data">Loading active projects...</p>
        ) : error ? (
          <p className="error-data">{error}</p>
        ) : activeProjects.length > 0 ? (
          activeProjects.map(project => (
            <div key={project.id} className="project-item">
              <div className="project-info">
                <span className="project-name">{project.name}</span>
                <span className="project-progress">{project.progress}%</span>
              </div>
              <div className="project-details">
                <div className="project-company">Company: {project.company}</div>
                <div className="project-budget">Budget: ${project.budget}</div>
                <div className="project-duration">Duration: {project.duration} days</div>
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <div className="project-actions">
                <button 
                  className="manage-btn" 
                  onClick={() => {
                    if (isProjectManager) {
                      navigate(`/tasks/${project.id}`)
                    } else {
                      // For non-manager users, navigate to assigned tasks page
                      const userData = JSON.parse(localStorage.getItem('userData'))
                      navigate(`/assigned-tasks/${userData._id}`)
                    }
                  }}>
                  {isProjectManager ? 'Assign Tasks' : 'Assigned Tasks'}
                </button>
                <button 
                  className="manage-btn" 
                  onClick={() => navigate(`/kanban/${project.id}`)}
                >
                  Manage Board
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-data">No active projects</p>
        )}
      </div>
    </div>
  )
}

export default ActiveProjectsCard