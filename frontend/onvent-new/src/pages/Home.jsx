import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import eventService from '../services/eventService'
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaSearch } from 'react-icons/fa'

const Home = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchFilters, setSearchFilters] = useState({
    title: '',
    category: '',
    date: ''
  })

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const data = await eventService.searchEvents(searchFilters)
      setEvents(data.content || [])
    } catch (err) {
      setError('Failed to load events')
      console.error('Error loading events:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    loadEvents()
  }

  const handleInputChange = (e) => {
    setSearchFilters({
      ...searchFilters,
      [e.target.name]: e.target.value
    })
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
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 mb-12 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">Your Event, Your Seat, Your Way</h1>
          <p className="text-xl mb-6">
            Discover and book tickets for the best events happening near you. From concerts to conferences, find your perfect experience.
          </p>
          <Link 
            to="/events" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-blue-50"
          >
            <FaTicketAlt className="mr-2" /> Browse Events
          </Link>
        </div>
      </div>

      {/* Search Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Events</h2>
        <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Event Title
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={searchFilters.title}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Search by title"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                name="category"
                id="category"
                value={searchFilters.category}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="e.g., Music, Tech"
              />
            </div>
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                id="date"
                value={searchFilters.date}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <button
              type="submit"
              className="w-full md:w-auto btn-primary"
            >
              Search Events
            </button>
          </div>
        </form>
      </div>

      {/* Featured Events */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Events</h2>
          <Link to="/events" className="text-primary hover:text-secondary font-medium">
            View All Events →
          </Link>
        </div>
        
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
              Check back later for new events.
            </p>
          </div>
        ) : (
          <div className="event-grid">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <FaCalendarAlt className="mr-2" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <FaMapMarkerAlt className="mr-2" />
                        {event.venue}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-primary">
                      ${event.price?.toFixed(2)}
                    </span>
                    <Link
                      to={`/events/${event.id}`}
                      className="btn-primary text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home