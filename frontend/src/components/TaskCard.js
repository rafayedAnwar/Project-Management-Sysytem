import React, { useState, useEffect } from 'react'
import '../styles/TaskAssignment.css'
import { getUsers } from '../services/api'

const TaskCard = ({ task, onTaskAssigned }) => {
  const [teamMembers, setTeamMembers] = useState([])
  const [formData, setFormData] = useState({
    assignedTo: '',
    priority: task.priority || 'Medium',
    allocatedTime: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  useEffect(() => {
    // Fetch team members from the API
    const fetchTeamMembers = async () => {
      try {
        console.log('Fetching team members for project ID:', task.project_id)
        const users = await getUsers()
        console.log('All users fetched:', users)
        
        // Filter users to only include those assigned to the current project
        const projectMembers = users.filter(user => {
          // Check if user has project_assigned and it matches the current project's ID
          const userProjectIds = user.project_assigned ? 
            (Array.isArray(user.project_assigned) ? user.project_assigned : [user.project_assigned]) : [];
          
          // Convert all IDs to strings for comparison
          const stringProjectIds = userProjectIds.map(id => {
            // Handle the case where id might be an object with _id property
            if (id && typeof id === 'object' && id._id) {
              return id._id.toString();
            }
            return typeof id === 'string' ? id : (id ? id.toString() : '');
          });
          
          // Only include users assigned to this project and not Project Managers
          const isAssignedToProject = stringProjectIds.includes(task.project_id);
          const isNotProjectManager = !user.titles || !user.titles.includes('Project Manager');
          
          console.log(`User ${user.fullName}: project_assigned=${JSON.stringify(stringProjectIds)}, isMatch=${isAssignedToProject}, isNotPM=${isNotProjectManager}`);
          
          return isAssignedToProject && isNotProjectManager;
        })
        
        console.log('Filtered project members:', projectMembers)
        
        // Transform users to the format expected by the component
        const formattedUsers = projectMembers.map(user => ({
          id: user._id,
          _id: user._id, // Keep the original _id for API calls
          name: user.fullName,
          role: user.titles && user.titles.length > 0 ? user.titles[0] : 'Team Member'
        }))
        
        console.log('Formatted team members:', formattedUsers)
        setTeamMembers(formattedUsers)
        
        // If no team members found, use only users assigned to this project (excluding PMs)
        if (formattedUsers.length === 0) {
          console.log('No team members found for this project, checking project status')
          
          // Fetch project details to check if it's an accepted project
          try {
            const projectResponse = await fetch(`http://localhost:4000/api/projects/${task.project_id}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
              }
            });
            
            if (projectResponse.ok) {
              const projectData = await projectResponse.json();
              console.log('Project data:', projectData);
              
              // Show all non-PM users as fallback regardless of project status
              // This ensures team members can always be selected
              console.log('Showing all non-PM users as fallback');
              const allNonPMUsers = users
                .filter(user => !user.titles || !user.titles.includes('Project Manager'))
                .map(user => ({
                  id: user._id,
                  _id: user._id,
                  name: user.fullName,
                  role: user.titles && user.titles.length > 0 ? user.titles[0] : 'Team Member'
                }));
              setTeamMembers(allNonPMUsers);
            }
          } catch (error) {
            console.error('Error fetching project details:', error);
            // Even if there's an error, show all non-PM users
            const allNonPMUsers = users
              .filter(user => !user.titles || !user.titles.includes('Project Manager'))
              .map(user => ({
                id: user._id,
                _id: user._id,
                name: user.fullName,
                role: user.titles && user.titles.length > 0 ? user.titles[0] : 'Team Member'
              }));
            setTeamMembers(allNonPMUsers);
          }
        }
      } catch (error) {
        console.error('Error fetching team members:', error)
        // Fallback to dummy data if API fails
        setTeamMembers([
          { id: 1, name: 'John Doe', role: 'Frontend Developer' },
          { id: 2, name: 'Jane Smith', role: 'Backend Developer' },
          { id: 3, name: 'Robert Johnson', role: 'UI/UX Designer' },
          { id: 4, name: 'Emily Wilson', role: 'Project Manager' },
          { id: 5, name: 'Michael Brown', role: 'DevOps Engineer' },
          { id: 6, name: 'Sarah Davis', role: 'QA Engineer' }
        ])
      }
    }
    
    if (task && task.project_id) {
      fetchTeamMembers()
    } else {
      console.error('No project_id provided for task:', task)
    }
  }, [task, task.project_id])
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    // Validate form
    if (!formData.assignedTo) {
      alert('Please select a team member')
      return
    }
    if (!formData.allocatedTime || isNaN(formData.allocatedTime)) {
      alert('Please enter a valid time allocation')
      return
    }
    setIsSubmitting(true)
    try {
      // Get the full team member object
      const assignedMember = teamMembers.find(member => member.id.toString() === formData.assignedTo)
      // Create assignment data
      const assignmentData = {
        ...formData,
        assignedTo: assignedMember,
        assignedAt: new Date().toISOString(),
        taskId: task.id
      }
      // Call the parent component's handler
      await onTaskAssigned(task.id, assignmentData)
    } catch (error) {
      console.error('Error in task assignment:', error)
      setIsSubmitting(false)
    }
  }
  return (
    <div className="task-card">
      <div className="task-header">
        <h2>{task.title}</h2>
        <span className="task-project">{task.project}</span>
      </div>
      <div className="task-description">
        <p>{task.description}</p>
      </div>
      <div className="task-deadline">
        <span className="deadline-label">Deadline:</span>
        <span className="deadline-date">{new Date(task.deadline).toLocaleDateString()}</span>
      </div>
      <form className="assignment-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor={`assignTo-${task.id}`}>Assign to:</label>
          <select 
            id={`assignTo-${task.id}`}
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            required
          >
            <option value="">Select team member</option>
            {teamMembers.map(member => (
              <option key={member.id} value={member.id}>
                {member.name} ({member.role})
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor={`priority-${task.id}`}>Priority:</label>
          <select 
            id={`priority-${task.id}`}
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor={`allocatedTime-${task.id}`}>Allocated Time (Days):</label>
          <input 
            type="number" 
            id={`allocatedTime-${task.id}`}
            name="allocatedTime"
            value={formData.allocatedTime}
            onChange={handleChange}
            min="0.5"
            step="0.5"
            required
            placeholder=""
          />
        </div>
        <button 
          type="submit" 
          className="done-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Assigning...' : 'Done'}
        </button>
      </form>
    </div>
  )
}
export default TaskCard

