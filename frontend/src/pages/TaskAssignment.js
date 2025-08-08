import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import TaskCard from '../components/TaskCard'
import { assignTask, getProject, getTasksByProject, createRandomTasks } from '../services/api'
import '../styles/TaskAssignment.css'
const TaskAssignment = () => {
  const { projectId } = useParams()
  const [tasks, setTasks] = useState([])
  const [project, setProject] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const fetchProjectAndTasks = async () => {
      try {
        // Fetch project details
        const projectData = await getProject(projectId)
        setProject(projectData)
        
        // Fetch tasks for this project
        try {
          // Check if project is accepted
          if (projectData.status === 'accepted' && projectData.aproval_stat === true) {
            const tasksData = await getTasksByProject(projectId)
            if (tasksData && tasksData.length > 0) {
              // Filter to only show pending tasks
              const pendingTasks = tasksData.filter(task => task.status === 'pending')
              setTasks(pendingTasks)
            } else {
              // If no tasks exist, create random tasks for this project
              const randomTasks = await createRandomTasks(projectId, 5)
              setTasks(randomTasks)
            }
          } else {
            // If project is not accepted, show no tasks
            setTasks([])
          }
        } catch (error) {
          console.error('Error fetching tasks:', error)
          // If there's an error fetching tasks and project is accepted, create random tasks
          if (projectData.status === 'accepted' && projectData.aproval_stat === true) {
            const randomTasks = await createRandomTasks(projectId, 5)
            // Filter to only include pending tasks
            const pendingRandomTasks = randomTasks.filter(task => task.status === 'pending')
            setTasks(pendingRandomTasks)
          } else {
            // If project is not accepted, show no tasks
            setTasks([])
          }
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching project data:', error)
        setIsLoading(false)
      }
    }
    
    fetchProjectAndTasks()
  }, [projectId])
  const handleTaskAssigned = async (taskId, assignmentData) => {
    try {
      // Prepare data for API
      const apiData = {
        assignedTo: assignmentData.assignedTo._id || assignmentData.assignedTo.id,
        priority: assignmentData.priority,
        allocatedTime: assignmentData.allocatedTime
      }
      
      // Call API to assign task
      await assignTask(taskId, apiData)
      
      // Remove task from the list
      setTasks(tasks.filter(task => task._id !== taskId))
    } catch (error) {
      console.error('Error assigning task:', error)
      alert('Failed to assign task. Please try again.')
    }
  }
  if (isLoading) {
    return (
      <div className="task-assignment-container">
        <Navbar />
        <div className="task-assignment-loading">Loading tasks...</div>
      </div>
    )
  }
  return (
    <div className="task-assignment-container">
      <Navbar />
      <div className="task-assignment-content">
        <div className="task-assignment-header">
          <div>
            <h1>Task Assignment</h1>
            {project && <h2 className="project-title">{project.title}</h2>}
            <p className="task-count">{tasks.length} tasks pending assignment</p>
          </div>
          <Link to="/dashboard" className="back-button">Back to Dashboard</Link>
        </div>
        {tasks.length > 0 ? (
          <div className="task-grid">
            {tasks.map(task => (
              <TaskCard 
                key={task._id} 
                task={{
                  ...task,
                  id: task._id, // Ensure id is available for backward compatibility
                  project: project ? project.title : 'Project', // Use project title from state
                  project_id: projectId // Pass the project ID for filtering team members
                }} 
                onTaskAssigned={handleTaskAssigned} 
              />
            ))}
          </div>
        ) : (
          <div className="no-tasks">
            <p>{project && project.status === 'accepted' ? 'No pending tasks available for assignment!' : 'This project has not been accepted yet.'}</p>
            <Link to="/dashboard" className="return-dashboard">Return to Dashboard</Link>
          </div>
        )}
      </div>
    </div>
  )
}
export default TaskAssignment