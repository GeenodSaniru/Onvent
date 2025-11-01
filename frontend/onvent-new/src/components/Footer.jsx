import React from 'react'
import { FaTicketAlt } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start items-center">
            <FaTicketAlt className="h-6 w-6 text-accent" />
            <span className="ml-2 text-lg font-bold">ONVENT</span>
          </div>
          <div className="mt-4 md:mt-0 md:order-1">
            <p className="text-center text-sm text-blue-200">
              &copy; 2025 ONVENT. Your Event, Your Seat, Your Way.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer