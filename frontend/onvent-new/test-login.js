// Simple test script to verify login functionality
const axios = require('axios');

// Configure axios to use the proxy
const api = axios.create({
  baseURL: 'http://localhost:5175/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

async function testLogin() {
  try {
    console.log('Testing login...');
    
    const response = await api.post('/v1/auth/login', {
      usernameOrEmail: 'logintestuser',
      password: 'Login123'
    });
    
    console.log('Login successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error;
  }
}

// Run the test
testLogin().catch(console.error);