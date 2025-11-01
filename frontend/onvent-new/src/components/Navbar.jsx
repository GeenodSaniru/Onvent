import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import authService from '../services/authService'
import { FaTicketAlt, FaUser, FaSignOutAlt, FaCalendarAlt, FaUsersCog } from 'react-icons/fa'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = authService.isAuthenticated()
  const userRole = authService.getUserRole()
  const user = authService.getUser()

  const handleLogout = async () => {
    try {
      await authService.logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      navigate('/login')
    }
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <FaTicketAlt className="h-8 w-8 text-accent" />
              <span className="ml-2 text-xl font-bold">ONVENT</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/') 
                    ? 'border-white text-white' 
                    : 'border-transparent text-blue-200 hover:border-blue-300 hover:text-white'
                }`}
              >
                <FaCalendarAlt className="mr-1" /> Events
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="hidden md:inline text-sm">
                  Welcome, {user?.name || user?.username}
                </span>
                {userRole === 'ADMIN' ? (
                  <Link
                    to="/admin/dashboard"
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/admin/dashboard')
                        ? 'bg-blue-800 text-white'
                        : 'text-blue-200 hover:bg-blue-700'
                    }`}
                  >
                    <FaUsersCog className="mr-1" /> Admin
                  </Link>
                ) : (
                  <Link
                    to="/user/dashboard"
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/user/dashboard')
                        ? 'bg-blue-800 text-white'
                        : 'text-blue-200 hover:bg-blue-700'
                    }`}
                  >
                    <FaUser className="mr-1" /> Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-blue-200 hover:bg-blue-700"
                >
                  <FaSignOutAlt className="mr-1" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary bg-white hover:bg-blue-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-secondary hover:bg-blue-600"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar