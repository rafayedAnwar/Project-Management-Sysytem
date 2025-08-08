import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import FormTeamCard from '../components/FormTeamCard'
import '../styles/ProjectDetails.css'
const ProjectDetails = () => {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/projects/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch project data');
        }
        
        const projectData = await response.json();
        
        // Transform the data to match the expected format
        setProject({
          id: projectData._id,
          title: projectData.title,
          companyName: projectData.companyName || 'Not specified',
          duration: projectData.duration ? `${projectData.duration} months` : 'Not specified',
          budget: projectData.budget ? `$${projectData.budget}` : 'Not specified',
          teamSize: projectData.team_size || 'Not specified',
          memberAllocation: projectData.team_size ? `${projectData.team_size} team members` : 'Not specified',
          about: projectData.description || 'No description available',
          status: projectData.status.charAt(0).toUpperCase() + projectData.status.slice(1),
          team: projectData.team || []
        });
      } catch (error) {
        console.error('Error fetching project data:', error);
        // Fallback to mock data in case of error
        setProject({
          id: id,
          title: "Project Details Unavailable",
          companyName: "Error loading data",
          duration: "Unknown",
          budget: "Unknown",
          memberAllocation: "Not specified",
          about: "There was an error loading the project details. Please try again later.",
          status: "Unknown"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjectData();
  }, [id])
  if (isLoading) {
    return (
      <div className="project-details-container">
        <Navbar />
        <div className="project-details-loading">Loading project details...</div>
      </div>
    )
  }
  return (
    <div className="project-details-container">
      <Navbar />
      <div className="project-details-content">
        <div className="project-details-header">
          <div>
            <h1>{project.title}</h1>
            <p className="company-name">{project.companyName}</p>
            <span className={`project-status ${project.status.toLowerCase().replace(/\s+/g, '-')}`}>
              {project.status}
            </span>
          </div>
          <Link to="/dashboard" className="back-button">Back to Dashboard</Link>
        </div>
        <div className="project-details-main">
          <div className="project-info-card">
            <h2>Project Details</h2>
            <div className="project-info-grid">
              <div className="info-item">
                <h3>Duration</h3>
                <p>{project.duration}</p>
              </div>
              <div className="info-item">
                <h3>Budget</h3>
                <p>{project.budget}</p>
              </div>
              <div className="info-item">
                <h3>Team Size</h3>
                <p>{project.teamSize}</p>
              </div>
            </div>
            <div className="project-about">
              <h3>About the Project</h3>
              <p>{project.about}</p>
            </div>
          </div>
          <FormTeamCard projectId={project.id} />
        </div>
      </div>
    </div>
  )
}
export default ProjectDetails