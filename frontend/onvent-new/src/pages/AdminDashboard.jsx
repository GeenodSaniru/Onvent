import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import eventService from '../services/eventService'
import ticketService from '../services/ticketService'
import { FaCalendarAlt, FaTicketAlt, FaUsers, FaPlus, FaEdit, FaTrash } from 'react-icons/fa'

const AdminDashboard = () => {
  const [events, setEvents] = useState([])
  const [eventStats, setEventStats] = useState({}) // New state for event statistics
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalTickets: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load dashboard statistics
      const statsData = await ticketService.getDashboardStats()
      
      // Load events
      const eventsData = await eventService.getEvents(0, 5)
      
      setStats({
        totalEvents: statsData.totalEvents || 0,
        totalTickets: statsData.totalTickets || 0,
        totalRevenue: statsData.totalRevenue || 0
      })
      
      // Fix: Use eventsData directly instead of eventsData.content
      const eventsList = Array.isArray(eventsData) ? eventsData : (eventsData.content || [])
      setEvents(eventsList)
      
      // Load event statistics for each event
      if (eventsList.length > 0) {
        loadEventStats(eventsList)
      }
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error('Error loading dashboard:', err)
    } finally {
      setLoading(false)
    }
  }
  
  // Load booking statistics for each event
  const loadEventStats = async (eventsList) => {
    try {
      const stats = {}
      for (const event of eventsList) {
        try {
          // Try the user endpoint first
          const eventStat = await ticketService.getEventBookingStatsForUsers(event.id)
          stats[event.id] = eventStat
        } catch (err) {
          console.error(`Error loading stats for event ${event.id}:`, err)
          // Check if it's a permission error (403)
          if (err.response && err.response.status === 403) {
            // Set a flag to indicate admin access is required
            stats[event.id] = {
              error: 'Admin access required',
              totalSeats: event.seats || 0,
              bookedSeats: 0,
              availableSeats: event.seats || 0,
              bookingPercentage: 0
            }
          } else {
            // Set default values if stats can't be loaded for other reasons
            stats[event.id] = {
              totalSeats: event.seats || 0,
              bookedSeats: 0,
              availableSeats: event.seats || 0,
              bookingPercentage: 0
            }
          }
        }
      }
      setEventStats(stats)
    } catch (err) {
      console.error('Error loading event statistics:', err)
    }
  }

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return
    }
    
    try {
      await eventService.deleteEvent(eventId)
      // Remove deleted event from the list
      setEvents(events.filter(event => event.id !== eventId))
      // Refresh stats
      loadDashboardData()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete event')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  // Function to get progress bar color based on booking percentage
  const getProgressBarColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage events and bookings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <FaCalendarAlt className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3">
              <FaTicketAlt className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tickets</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTickets}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3">
              <FaUsers className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Recent Events</h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage your events
              </p>
            </div>
            <Link
              to="/admin/events/create"
              className="btn-primary"
            >
              <FaPlus className="mr-2" />
              Create Event
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="loading-spinner"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new event.
              </p>
              <div className="mt-6">
                <Link
                  to="/admin/events/create"
                  className="btn-primary"
                >
                  <FaPlus className="mr-2" />
                  Create Event
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking Stats
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => {
                    const stats = eventStats[event.id] || {
                      totalSeats: event.seats || 0,
                      bookedSeats: 0,
                      availableSeats: event.seats || 0,
                      bookingPercentage: 0
                    }
                    
                    return (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{event.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {event.date ? formatDate(event.date) : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {event.category || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${event.price?.toFixed(2) || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full">
                              {stats.error ? (
                                <div className="text-xs text-gray-500 italic">
                                  {stats.error}
                                </div>
                              ) : (
                                <>
                                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                                    <span>{stats.bookedSeats} booked</span>
                                    <span>{stats.availableSeats} available</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full ${getProgressBarColor(stats.bookingPercentage)}`}
                                      style={{ width: `${stats.bookingPercentage}%` }}
                                    ></div>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {Math.round(stats.bookingPercentage)}% booked
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            to={`/admin/events/${event.id}/edit`}
                            className="text-primary hover:text-blue-900 mr-3"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard