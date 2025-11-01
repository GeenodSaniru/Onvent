import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const ProtectedRoute = ({ children, role }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken')
      const userRole = localStorage.getItem('userRole')
      
      if (!token) {
        // Not logged in, redirect to login
        navigate('/login')
        return
      }
      
      if (role && userRole !== role) {
        // Role mismatch, redirect to appropriate dashboard
        if (userRole === 'ADMIN') {
          navigate('/admin/dashboard')
        } else {
          navigate('/user/dashboard')
        }
        return
      }
      
      // Authorized
      setIsAuthorized(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [navigate, role])

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    )
  }

  return isAuthorized ? children : null
}

export default ProtectedRoute
