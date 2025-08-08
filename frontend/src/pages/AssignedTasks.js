import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getTasksByUser } from '../services/api'
import '../styles/Dashboard.css'

const AssignedTasks = () => {
  const { userId } = useParams()
  const [assignedTasks, setAssignedTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAssignedTasks = async () => {
      try {
        setIsLoading(true)
        const tasks = await getTasksByUser(userId)
        setAssignedTasks(tasks)
        setError(null)
      } catch (err) {
        console.error('Error fetching assigned tasks:', err)
        setError('Failed to load assigned tasks. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAssignedTasks()
  }, [userId])

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Function to determine priority class
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'priority-high'
      case 'Medium':
        return 'priority-medium'
      case 'Low':
        return 'priority-low'
      default:
        return ''
    }
  }

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1>Your Assigned Tasks</h1>
          <p className="dashboard-date">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </header>

        <div className="assigned-tasks-container">
          {isLoading ? (
            <p className="loading-data">Loading assigned tasks...</p>
          ) : error ? (
            <p className="error-data">{error}</p>
          ) : assignedTasks.length > 0 ? (
            <div className="tasks-grid">
              {assignedTasks.map((task) => (
                <div key={task._id} className="task-card">
                  <div className="task-header">
                    <h3 className="task-title">{task.title}</h3>
                    <span className={`task-priority ${getPriorityClass(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="task-description">{task.description}</div>
                  <div className="task-details">
                    <div className="task-deadline">
                      <strong>Deadline:</strong> {formatDate(task.deadline)}
                    </div>
                    <div className="task-status">
                      <strong>Status:</strong> {task.status}
                    </div>
                    {task.allocatedTime > 0 && (
                      <div className="task-time">
                        <strong>Allocated Time:</strong> {task.allocatedTime} hours
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">You don't have any assigned tasks.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AssignedTasks