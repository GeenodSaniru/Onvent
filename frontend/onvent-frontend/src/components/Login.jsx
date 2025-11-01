import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

const Login = () => {
  const [credentials, setCredentials] = useState({
    usernameOrEmail: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await api.post('/api/auth/login', credentials)
      
      if (response.data) {
        // Store auth data
        localStorage.setItem('authToken', 'true')
        localStorage.setItem('userRole', response.data.role)
        localStorage.setItem('userId', response.data.id)
        
        // Redirect based on role
        if (response.data.role === 'ADMIN') {
          navigate('/admin/dashboard')
        } else {
          navigate('/user/dashboard')
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login to Your Account</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="usernameOrEmail">Email or Username</label>
          </div>
          <div className="form-group">
            <input
              type="text"
              id="usernameOrEmail"
              name="usernameOrEmail"
              value={credentials.usernameOrEmail}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter your email or username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="auth-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  )
}

export default Login