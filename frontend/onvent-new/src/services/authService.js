import api from './api'

class AuthService {
  // Store authentication tokens and user data
  setAuthData(userData) {
    try {
      localStorage.setItem('authToken', 'true'); // Using a simple token for this session-based auth
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userRole', userData.role);
      return true;
    } catch (error) {
      console.error('Error storing auth data:', error);
      return false;
    }
  }

  // Get authentication token
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  // Get user role
  getUserRole() {
    return localStorage.getItem('userRole');
  }

  // Get user data
  getUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getAuthToken();
  }

  // Check if user has specific role
  hasRole(role) {
    return this.getUserRole() === role;
  }

  // Clear authentication data
  clearAuthData() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
  }

  // Login user
  async login(credentials) {
    try {
      const response = await api.post('/api/v1/auth/login', credentials);
      if (response.data) {
        this.setAuthData(response.data);
        return response.data;
      }
      throw new Error('Login failed');
    } catch (error) {
      this.clearAuthData();
      throw error;
    }
  }

  // Register user
  async register(userData) {
    try {
      const response = await api.post('/api/v1/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      await api.post('/api/v1/auth/logout');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      this.clearAuthData();
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const response = await api.get('/api/v1/auth/me');
      if (response.data) {
        this.setAuthData(response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      this.clearAuthData();
      throw error;
    }
  }
}

export default new AuthService()