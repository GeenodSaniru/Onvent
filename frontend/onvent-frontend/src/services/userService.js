import api from './api';

class UserService {
  // User registration
  registerUser(userData) {
    return api.post('/api/auth/signup', userData);
  }

  // Create a new user (legacy endpoint)
  createUser(user) {
    return api.post('/users/create', user);
  }

  // Get all users
  getAllUsers() {
    return api.get('/users/all');
  }

  // Get user by ID
  getUserById(id) {
    return api.get(`/users/${id}`);
  }

  // Update user by ID
  updateUser(id, user) {
    return api.put(`/users/update/${id}`, user);
  }

  // Delete user by ID
  deleteUser(id) {
    return api.delete(`/users/delete/${id}`);
  }

  // Get current user profile
  getCurrentUser() {
    return api.get('/api/auth/me');
  }

  // Update user profile
  updateProfile(profileData) {
    return api.put('/api/users/profile', profileData);
  }

  // Update user password
  updatePassword(passwordData) {
    return api.put('/api/users/password', passwordData);
  }
}

export default new UserService();