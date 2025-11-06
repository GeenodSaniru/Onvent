// Simple test script to verify registration functionality
const axios = require('axios');

// Configure axios to use the proxy
const api = axios.create({
  baseURL: 'http://localhost:5175/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

async function testRegistration() {
  try {
    console.log('Testing registration...');
    
    const response = await api.post('/v1/auth/signup', {
      username: 'testuser' + Date.now(),
      email: 'test' + Date.now() + '@example.com',
      name: 'Test User',
      password: 'Test1234'
    });
    
    console.log('Registration successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
    throw error;
  }
}

// Run the test
testRegistration().catch(console.error);