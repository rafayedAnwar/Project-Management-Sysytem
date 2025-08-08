import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { logoutUser } from '../services/api'
import '../styles/Navbar.css'
const Navbar = () => {
  const navigate = useNavigate()
  
  const handleLogout = () => {
    logoutUser()
    navigate('/')
  }
  
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>Project Manager</h1>
      </div>
      <ul className="navbar-links">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><button className="logout-button" onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  )
}
export default Navbar