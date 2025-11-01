import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'

const ProtectedRoute = ({ children, role }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated
        if (!authService.isAuthenticated()) {
          // Not logged in, redirect to login
          navigate('/login')
          return
        }

        // If specific role is required, check it
        if (role && !authService.hasRole(role)) {
          // Role mismatch, redirect to appropriate dashboard
          if (authService.hasRole('ADMIN')) {
            navigate('/admin/dashboard')
          } else {
            navigate('/user/dashboard')
          }
          return
        }

        // Authorized
        setIsAuthorized(true)
      } catch (error) {
        console.error('Error checking authentication:', error)
        // Clear auth data and redirect to login
        authService.clearAuthData()
        navigate('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [navigate, role])

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="mt-2 text-center">Checking authentication...</p>
      </div>
    )
  }

  return isAuthorized ? children : null
}

export default ProtectedRoute