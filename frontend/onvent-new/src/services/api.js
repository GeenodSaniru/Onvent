import axios from 'axios'

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Add a request interceptor to include CSRF token
api.interceptors.request.use(
  (config) => {
    // Get CSRF token from meta tag or cookie if available
    const csrfToken = document.querySelector('meta[name="_csrf"]')?.getAttribute('content') || 
                     document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN'))?.split('=')[1];
    
    if (csrfToken) {
      config.headers['X-XSRF-TOKEN'] = csrfToken;
    }
    
    const token = localStorage.getItem('authToken')
    if (token) {
      // Add authorization header if needed
      // config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add a response interceptor to handle auth errors and CSRF tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect to login for registration or login requests
    if (error.config?.url?.includes('/signup') || error.config?.url?.includes('/login')) {
      return Promise.reject(error);
    }
    
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear auth data and redirect to login
      localStorage.removeItem('authToken')
      localStorage.removeItem('userRole')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api