import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import PendingRequestsBox from '../components/PendingRequestsBox'
import ActiveProjectsCard from '../components/ActiveProjectsCard'
import TeamMembersCard from '../components/TeamMembersCard'
import NotificationsCard from '../components/NotificationsCard'
import '../styles/Dashboard.css'
const Dashboard = () => {
  // eslint-disable-next-line no-unused-vars
  const [username, setUsername] = useState('Admin')
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Get user data from localStorage if available
    try {
      const userData = localStorage.getItem('userData')
      if (userData) {
        const user = JSON.parse(userData)
        if (user && user.fullName) {
          setUsername(user.fullName)
        }
      }
    } catch (error) {
      console.error('Error parsing user data:', error)
    }
  }, [])
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
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
          <h1>Welcome, {username}!</h1>
          <p className="dashboard-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </header>
        <div className="dashboard-main">
          <div className="dashboard-top-row">
            <PendingRequestsBox />
            <NotificationsCard />
          </div>
          <div className="dashboard-middle-row">
            <ActiveProjectsCard />
          </div>
          <div className="dashboard-bottom-row">
            <TeamMembersCard />
          </div>
        </div>
      </div>
    </div>
  )
}
export default Dashboard