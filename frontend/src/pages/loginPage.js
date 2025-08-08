import React from 'react'
import LoginForm from '../components/loginForm'
import '../styles/Login.css'

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Welcome</h1>
          <p>Please login to access your company account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

export default LoginPage