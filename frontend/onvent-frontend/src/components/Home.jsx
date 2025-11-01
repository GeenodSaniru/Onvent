import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="home">
      <div className="hero-section">
        <h1 className="hero-title">Welcome to ONVENT</h1>
        <p className="hero-subtitle">Your Event, Your Seat, Your Way</p>
        <div className="hero-buttons">
          <Link to="/events" className="btn btn-primary">Browse Events</Link>
          <Link to="/login" className="btn btn-secondary">Login</Link>
        </div>
      </div>
      
      <div className="features-section">
        <div className="feature-card">
          <h3>🎫 Easy Booking</h3>
          <p>Book your tickets in just a few clicks</p>
        </div>
        <div className="feature-card">
          <h3>📧 Email Confirmation</h3>
          <p>Receive instant booking confirmations</p>
        </div>
        <div className="feature-card">
          <h3>📄 PDF Tickets</h3>
          <p>Download and print your tickets</p>
        </div>
      </div>
    </div>
  )
}

export default Home