import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUsers, updateProjectTeam, updateProjectStatus, getProject, assignUserToProject } from '../services/api'
import '../styles/ProjectDetails.css'

const FormTeamCard = ({ projectId }) => {
  const navigate = useNavigate()
  const [availableMembers, setAvailableMembers] = useState([])
  const [selectedMembers, setSelectedMembers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [project, setProject] = useState(null)
  const [maxTeamSize, setMaxTeamSize] = useState(5)

  useEffect(() => {
    const fetchProjectAndUsers = async () => {
      try {
        setIsLoading(true)
        
        // Fetch project details to get max team size
        const projectData = await getProject(projectId)
        setProject(projectData)
        setMaxTeamSize(projectData.team_size || 5)
        
        const users = await getUsers()
        
        // Filter out users with 'Project Manager' title
        const filteredUsers = users.filter(user => 
          !user.titles || !user.titles.includes('Project Manager')
        )

        // Format users for display
        const formattedUsers = filteredUsers.map(user => ({
          id: user._id,
          name: user.fullName,
          role: user.titles && user.titles.length > 0 ? user.titles[0] : 'Team Member',
          avatar: user.fullName.charAt(0),
          email: user.email,
          skills: user.skills || []
        }))

        setAvailableMembers(formattedUsers)
        setError(null)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load project data or team members. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjectAndUsers()
  }, [projectId])
  const toggleMemberSelection = (member) => {
    if (selectedMembers.some(m => m.id === member.id)) {
      setSelectedMembers(selectedMembers.filter(m => m.id !== member.id))
    } else {
      // Check if adding this member would exceed the maximum team size
      if (selectedMembers.length < maxTeamSize) {
        setSelectedMembers([...selectedMembers, member])
      } else {
        alert(`Maximum team size of ${maxTeamSize} reached. Remove a member before adding a new one.`)
      }
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (selectedMembers.length === 0) {
      setError('Please select at least one team member')
      return
    }
    
    try {
      // Get current user from localStorage (the project manager)
      const currentUserData = JSON.parse(localStorage.getItem('userData'))
      
      // Prepare team data
      const teamData = {
        status: 'accepted',
        projectManager: currentUserData._id,
        team: selectedMembers.map(member => member.id)
      }
      
      // Update project with team data
      await updateProjectTeam(projectId, teamData)
      
      // Update each team member's user document with project_assigned reference
      const updatePromises = selectedMembers.map(member => {
        return assignUserToProject(member.id, projectId)
      })
      
      // Wait for all user updates to complete
      await Promise.all(updatePromises)
      
      // Show success message
      alert('Team formed successfully!')
      
      // Redirect to dashboard
      navigate('/dashboard')
    } catch (err) {
      console.error('Error forming team:', err)
      // Extract more specific error message if available
      let errorMessage = 'Failed to form team. Please try again.';
      
      // Check if the error contains HTML (which indicates a routing issue)
      if (err.message && err.message.includes('<!DOCTYPE')) {
        errorMessage = 'Error forming team: The server returned an HTML page instead of JSON. This usually indicates a server-side issue or incorrect API endpoint.';
      } else if (err.message) {
        errorMessage = `Error forming team: ${err.message}`;
      }
      
      setError(errorMessage);
    }
  }
  if (isLoading) {
    return (
      <div className="form-team-card">
        <h2>Form Team for this Project</h2>
        <div className="loading-members">Loading project data and team members...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="form-team-card">
        <h2>Form Team for this Project</h2>
        <div className="error-message">{error}</div>
      </div>
    )
  }
  
  // Always show the form regardless of project status
  return (
    <div className="form-team-card">
      <h2>Form Team for this Project</h2>
      <form onSubmit={handleSubmit}>
        <div className="team-selection">
          <div className="available-members">
            <h3>Available Team Members</h3>
            <div className="members-list">
              {availableMembers.map(member => (
                <div 
                  key={member.id} 
                  className={`member-card ${selectedMembers.some(m => m.id === member.id) ? 'selected' : ''}`}
                  onClick={() => toggleMemberSelection(member)}
                >
                  <div className="member-avatar">{member.avatar}</div>
                  <div className="member-details">
                    <div className="member-name">{member.name}</div>
                    <div className="member-role">{member.role}</div>
                    <div className="member-skills">
                      {member.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div className="selection-indicator"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="selected-team">
            <h3>Selected Team ({selectedMembers.length}/{maxTeamSize})</h3>
            {selectedMembers.length > 0 ? (
              <div className="selected-members-list">
                {selectedMembers.map(member => (
                  <div key={member.id} className="selected-member">
                    <div className="member-avatar">{member.avatar}</div>
                    <div className="member-name">{member.name}</div>
                    <button 
                      type="button" 
                      className="remove-member" 
                      onClick={() => toggleMemberSelection(member)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-selection">No team members selected yet</p>
            )}
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="form-team-btn" disabled={selectedMembers.length === 0}>
            Form Team
          </button>
        </div>
      </form>
    </div>
  )
}
export default FormTeamCard