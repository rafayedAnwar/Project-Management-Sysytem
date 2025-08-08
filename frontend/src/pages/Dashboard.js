import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import PendingRequestsBox from '../components/PendingRequestsBox'
import ActiveProjectsCard from '../components/ActiveProjectsCard'
import ReviewCard from '../components/ReviewCard'
import { getProjects } from '../services/api'
import '../styles/Dashboard.css'

const Dashboard = () => {
  const [username, setUsername] = useState('Admin')
  const [isLoading, setIsLoading] = useState(true)
  const [hasPendingProjects, setHasPendingProjects] = useState(false)
  const [isProjectManager, setIsProjectManager] = useState(false)

  useEffect(() => {
    try {
      const userData = localStorage.getItem('userData')
      if (userData) {
        const user = JSON.parse(userData)
        if (user && user.fullName) {
          setUsername(user.fullName)
        }
        
        // Check if user has Project Manager title
        if (user && user.titles && user.titles.includes('Project Manager')) {
          setIsProjectManager(true)
        }
      }
    } catch (error) {
      console.error('Error parsing user data:', error)
    }
  }, [])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await getProjects()
        // Check if there are any pending projects
        const pendingProjects = projects.filter(project => project.status === 'pending')
        setHasPendingProjects(pendingProjects.length > 0)
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProjects()
  }, [])

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <div className="dashboard-loading">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1>Welcome to your Dashboard</h1>
          <p className="dashboard-date">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </header>
        <div className="dashboard-main">
          {hasPendingProjects && isProjectManager && <PendingRequestsBox />}
          <ActiveProjectsCard />
          <ReviewCard />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
