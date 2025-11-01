import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('authToken')
    const role = localStorage.getItem('userRole')
    
    if (token) {
      setIsLoggedIn(true)
      setUserRole(role)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userId')
    setIsLoggedIn(false)
    setUserRole('')
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🎫 ONVENT
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/events" className="nav-link">Events</Link>
          </li>
          {!isLoggedIn ? (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">Register</Link>
              </li>
            </>
          ) : (
            <>
              {userRole === 'ADMIN' ? (
                <li className="nav-item">
                  <Link to="/admin/dashboard" className="nav-link">Admin Dashboard</Link>
                </li>
              ) : (
                <li className="nav-item">
                  <Link to="/user/dashboard" className="nav-link">My Dashboard</Link>
                </li>
              )}
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar