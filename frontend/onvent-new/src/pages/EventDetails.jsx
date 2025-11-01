import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import eventService from '../services/eventService'
import authService from '../services/authService'
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaChair, FaUser } from 'react-icons/fa'

const EventDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const isAuthenticated = authService.isAuthenticated()

  useEffect(() => {
    loadEvent()
  }, [id])

  const loadEvent = async () => {
    try {
      setLoading(true)
      const data = await eventService.getEventById(id)
      setEvent(data)
    } catch (err) {
      setError('Failed to load event details')
      console.error('Error loading event:', err)
    } finally {
      setLoading(false)
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

  const handleBookTickets = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    navigate(`/book/${id}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error || 'Event not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {event.imageUrl && (
          <div className="h-64 bg-gray-200 flex items-center justify-center">
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.parentElement.innerHTML = '<div className="text-gray-500">Event Image</div>'
              }}
            />
          </div>
        )}
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center text-gray-600">
                  <FaCalendarAlt className="mr-2" />
                  {formatDate(event.date)}
                </div>
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="mr-2" />
                  {event.venue}
                </div>
                <div className="flex items-center text-gray-600">
                  <FaChair className="mr-2" />
                  {event.seats} seats available
                </div>
              </div>
              <div className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                {event.category}
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 text-right">
              <div className="text-3xl font-bold text-primary mb-2">
                ${event.price?.toFixed(2)}
              </div>
              <button
                onClick={handleBookTickets}
                className="btn-primary"
              >
                <FaTicketAlt className="mr-2" />
                Book Tickets
              </button>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Event Description</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {event.description || 'No description available for this event.'}
            </p>
          </div>
          
          {!isAuthenticated && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FaUser className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Want to book tickets?</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        You need to be logged in to book tickets for this event.
                      </p>
                    </div>
                    <div className="mt-4">
                      <div className="flex space-x-2">
                        <Link
                          to="/login"
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-blue-700"
                        >
                          Sign in
                        </Link>
                        <Link
                          to="/register"
                          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Register
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventDetails