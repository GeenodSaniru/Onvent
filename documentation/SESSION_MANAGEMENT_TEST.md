# Session Management Test Guide

## Overview
This document provides instructions for testing the session management fixes to ensure that user sessions persist properly between page navigations.

## Test Scenarios

### 1. Login and Navigation Test
1. Navigate to the login page (http://localhost:5174/login)
2. Enter valid credentials and log in
3. Verify successful login message appears
4. Wait for automatic redirect to dashboard
5. Navigate to other pages (Events, etc.)
6. Verify that user remains logged in
7. Refresh the page and verify authentication persists

### 2. Session Timeout Test
1. Log in successfully
2. Wait for 30 minutes without activity
3. Attempt to navigate to a protected page
4. Verify that user is redirected to login page

### 3. Explicit Logout Test
1. Log in successfully
2. Navigate to multiple pages
3. Click the "Sign Out" button in the profile dropdown
4. Verify that user is redirected to login page
5. Verify that session cookies are cleared

### 4. Cross-Page Authentication Test
1. Log in successfully
2. Open a new tab and navigate to a protected page
3. Verify that user is authenticated in the new tab

## Expected Behavior

### Session Persistence
- Users should remain logged in when navigating between pages
- Session should persist through page refreshes
- Authentication state should be maintained for 30 minutes of inactivity

### Session Termination
- Sessions should expire after 30 minutes of inactivity
- Explicit logout should immediately terminate the session
- Session cookies should be properly cleared on logout

### Error Handling
- Network errors should not incorrectly mark users as logged out
- Authentication checks should be resilient to temporary backend issues
- Proper error messages should be displayed for authentication failures

## Troubleshooting

### Common Issues

1. **Session Not Persisting**
   - Check browser console for CORS errors
   - Verify that cookies are being sent with requests
   - Check backend logs for session creation errors

2. **Premature Logout**
   - Verify session timeout configuration
   - Check for network issues causing authentication check failures
   - Ensure browser is not blocking cookies

3. **Authentication State Inconsistency**
   - Check that localStorage values match actual authentication state
   - Verify periodic authentication checks are working
   - Ensure backend and frontend authentication states are synchronized

## Verification Commands

### Check Session Cookies
```bash
# After successful login, check for session cookie
curl -I -X POST http://localhost:8086/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail": "testuser", "password": "TestPass123"}' \
  --cookie-jar cookies.txt
```

### Verify Authentication State
```bash
# Check if session is still valid
curl -X GET http://localhost:8086/api/auth/me \
  --cookie cookies.txt
```

### Test Logout
```bash
# Test logout functionality
curl -X POST http://localhost:8086/api/auth/logout \
  --cookie cookies.txt
```

## Configuration Verification

### Backend Settings
- Session timeout: 30 minutes
- Cookie settings: HttpOnly, SameSite=None
- CORS configuration: Allows credentials from frontend origin

### Frontend Settings
- Axios configured with `withCredentials: true`
- Periodic authentication checks every 5 minutes
- Proper error handling for network issues

## Rollback Plan

If issues persist after these changes:

1. Revert session management configuration in SecurityConfig.java
2. Remove session configuration from application.properties
3. Revert Layout.jsx and UserLogin.jsx changes
4. Test with original configuration to confirm regression