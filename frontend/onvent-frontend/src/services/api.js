import axios from 'axios';

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: 'http://localhost:8086', // Updated to new Spring Boot backend port
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for session-based authentication
});

export default api;