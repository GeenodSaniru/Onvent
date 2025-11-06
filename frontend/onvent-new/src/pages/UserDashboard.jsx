import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ticketService from '../services/ticketService'
import eventService from '../services/eventService'
import authService from '../services/authService'
import { FaTicketAlt, FaCalendarAlt, FaMapMarkerAlt, FaChair, FaTimes } from 'react-icons/fa'

const UserDashboard = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelingTicket, setCancelingTicket] = useState(null)
  const user = authService.getUser()

  useEffect(() => {
    loadUserTickets()
  }, [])

  const loadUserTickets = async () => {
    try {
      setLoading(true)
      const data = await ticketService.getUserTicketsList()
      // Sort tickets by booking date (newest first)
      const sortedTickets = data.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate))
      setTickets(sortedTickets)
    } catch (err) {
      setError('Failed to load your tickets')
      console.error('Error loading tickets:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to cancel this ticket?')) {
      return
    }
    
    try {
      setCancelingTicket(ticketId)
      await ticketService.cancelTicket(ticketId)
      // Remove cancelled ticket from the list
      setTickets(tickets.filter(ticket => ticket.ticketId !== ticketId))
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel ticket')
    } finally {
      setCancelingTicket(null)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name || user?.username}!</p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">My Upcoming Events</h2>
          <p className="mt-1 text-sm text-gray-500">
            View and manage your booked tickets
          </p>
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
          ) : tickets.length === 0 ? (
            <div className="text-center py-12">
              <FaTicketAlt className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets booked</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by booking your first event ticket.
              </p>
              <div className="mt-6">
                <Link
                  to="/events"
                  className="btn-primary"
                >
                  Browse Events
                </Link>
              </div>
            </div>
          ) : (
            <div className="ticket-list">
              {tickets.map((ticket) => (
                <div key={ticket.ticketId} className="ticket-item">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-lg font-bold text-gray-900">
                          {ticket.eventTitle || 'Event Title'}
                        </h3>
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {ticket.status}
                        </span>
                      </div>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <FaCalendarAlt className="mr-2" />
                          {ticket.eventDate ? formatDate(ticket.eventDate) : 'Event Date'}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <FaMapMarkerAlt className="mr-2" />
                          {ticket.eventLocation || 'Event Venue'}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <FaChair className="mr-2" />
                          1 ticket
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <FaTicketAlt className="mr-2" />
                          Total: ${ticket.eventPrice?.toFixed(2)}
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        Booked on: {formatDate(ticket.purchaseDate)}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        Ticket Code: {ticket.ticketCode}
                      </div>
                    </div>
                    <button
                      onClick={() => handleCancelTicket(ticket.ticketId)}
                      disabled={cancelingTicket === ticket.ticketId}
                      className="ml-4 inline-flex items-center p-2 border border-transparent rounded-full text-red-700 hover:bg-red-100 focus:outline-none"
                    >
                      {cancelingTicket === ticket.ticketId ? (
                        <div className="loading-spinner w-4 h-4"></div>
                      ) : (
                        <FaTimes className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard