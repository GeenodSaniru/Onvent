# Authentication & Authorization Testing Guide

## Prerequisites
- Application running on `http://localhost:8085`
- Testing tool: Postman, Thunder Client, or curl
- Database accessible

## Test Scenarios

### 1. User Registration Tests

#### Test 1.1: Register a Regular User (SUCCESS)
```http
POST http://localhost:8085/api/auth/signup
Content-Type: application/json

{
  "username": "testuser",
  "name": "Test User",
  "email": "testuser@example.com",
  "password": "TestPass123"
}
```
**Expected Result**: 201 Created with user details

#### Test 1.2: Register an Admin User (SUCCESS)
```http
POST http://localhost:8085/api/auth/signup
Content-Type: application/json

{
  "username": "admin",
  "name": "Admin User",
  "email": "admin@onvent.com",
  "password": "Admin1234",
  "role": "ADMIN"
}
```
**Expected Result**: 201 Created with admin details

#### Test 1.3: Duplicate Username (FAIL)
```http
POST http://localhost:8085/api/auth/signup
Content-Type: application/json

{
  "username": "testuser",
  "name": "Another User",
  "email": "another@example.com",
  "password": "TestPass123"
}
```
**Expected Result**: 400 Bad Request - "Username already exists"

#### Test 1.4: Duplicate Email (FAIL)
```http
POST http://localhost:8085/api/auth/signup
Content-Type: application/json

{
  "username": "newuser",
  "name": "New User",
  "email": "testuser@example.com",
  "password": "TestPass123"
}
```
**Expected Result**: 400 Bad Request - "Email already exists"

#### Test 1.5: Weak Password (FAIL)
```http
POST http://localhost:8085/api/auth/signup
Content-Type: application/json

{
  "username": "weakuser",
  "name": "Weak User",
  "email": "weak@example.com",
  "password": "weak"
}
```
**Expected Result**: 400 Bad Request - Password validation error

#### Test 1.6: Missing Required Fields (FAIL)
```http
POST http://localhost:8085/api/auth/signup
Content-Type: application/json

{
  "username": "incomplete"
}
```
**Expected Result**: 400 Bad Request - Validation errors

### 2. Login Tests

#### Test 2.1: Login with Username (SUCCESS)
```http
POST http://localhost:8085/api/auth/login
Content-Type: application/json

{
  "usernameOrEmail": "testuser",
  "password": "TestPass123"
}
```
**Expected Result**: 200 OK with user details and session cookie

#### Test 2.2: Login with Email (SUCCESS)
```http
POST http://localhost:8085/api/auth/login
Content-Type: application/json

{
  "usernameOrEmail": "testuser@example.com",
  "password": "TestPass123"
}
```
**Expected Result**: 200 OK with user details and session cookie

#### Test 2.3: Invalid Password (FAIL)
```http
POST http://localhost:8085/api/auth/login
Content-Type: application/json

{
  "usernameOrEmail": "testuser",
  "password": "WrongPassword"
}
```
**Expected Result**: 401 Unauthorized - "Invalid username/email or password"

#### Test 2.4: Non-existent User (FAIL)
```http
POST http://localhost:8085/api/auth/login
Content-Type: application/json

{
  "usernameOrEmail": "nonexistent",
  "password": "TestPass123"
}
```
**Expected Result**: 401 Unauthorized

### 3. Authentication Tests

#### Test 3.1: Get Current User (Authenticated)
```http
GET http://localhost:8085/api/auth/me
Cookie: ONVENT_SESSION=<session-id>
```
**Expected Result**: 200 OK with current user details

#### Test 3.2: Get Current User (Not Authenticated)
```http
GET http://localhost:8085/api/auth/me
```
**Expected Result**: 401 Unauthorized

### 4. Profile Management Tests

#### Test 4.1: Get Own Profile (Authenticated)
```http
GET http://localhost:8085/users/profile
Cookie: ONVENT_SESSION=<session-id>
```
**Expected Result**: 200 OK with profile details

#### Test 4.2: Update Own Profile (SUCCESS)
```http
PUT http://localhost:8085/users/profile
Cookie: ONVENT_SESSION=<session-id>
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "newemail@example.com"
}
```
**Expected Result**: 200 OK with updated profile

#### Test 4.3: Update Profile (Not Authenticated)
```http
PUT http://localhost:8085/users/profile
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "newemail@example.com"
}
```
**Expected Result**: 401 Unauthorized

### 5. Role-Based Access Control Tests

#### Test 5.1: Browse Events (Unauthenticated - SUCCESS)
```http
GET http://localhost:8085/events/all
```
**Expected Result**: 200 OK with events list

#### Test 5.2: Create Event as USER (FAIL)
First, login as regular user, then:
```http
POST http://localhost:8085/events/create
Cookie: ONVENT_SESSION=<user-session-id>
Content-Type: application/json

{
  "title": "Test Event",
  "description": "Test Description",
  "location": "Test Location",
  "eventDate": "2025-12-01",
  "maxAttendees": 100
}
```
**Expected Result**: 403 Forbidden - Insufficient permissions

#### Test 5.3: Create Event as ADMIN (SUCCESS)
First, login as admin, then:
```http
POST http://localhost:8085/events/create
Cookie: ONVENT_SESSION=<admin-session-id>
Content-Type: application/json

{
  "title": "Test Event",
  "description": "Test Description",
  "location": "Test Location",
  "eventDate": "2025-12-01",
  "maxAttendees": 100
}
```
**Expected Result**: 201 Created with event details

#### Test 5.4: Book Ticket as USER (SUCCESS)
Login as user, then:
```http
POST http://localhost:8085/tickets/book
Cookie: ONVENT_SESSION=<user-session-id>
Content-Type: application/json

{
  "userId": 1,
  "eventId": 1,
  "numberOfSeats": 2
}
```
**Expected Result**: 201 Created with booking details

#### Test 5.5: Book Ticket (Not Authenticated - FAIL)
```http
POST http://localhost:8085/tickets/book
Content-Type: application/json

{
  "userId": 1,
  "eventId": 1,
  "numberOfSeats": 2
}
```
**Expected Result**: 401 Unauthorized

#### Test 5.6: View All Tickets as USER (FAIL)
```http
GET http://localhost:8085/tickets/all
Cookie: ONVENT_SESSION=<user-session-id>
```
**Expected Result**: 403 Forbidden

#### Test 5.7: View All Tickets as ADMIN (SUCCESS)
```http
GET http://localhost:8085/tickets/all
Cookie: ONVENT_SESSION=<admin-session-id>
```
**Expected Result**: 200 OK with all tickets

#### Test 5.8: View User by ID as USER (FAIL)
```http
GET http://localhost:8085/users/1
Cookie: ONVENT_SESSION=<user-session-id>
```
**Expected Result**: 403 Forbidden

#### Test 5.9: View User by ID as ADMIN (SUCCESS)
```http
GET http://localhost:8085/users/1
Cookie: ONVENT_SESSION=<admin-session-id>
```
**Expected Result**: 200 OK with user details

### 6. Logout Tests

#### Test 6.1: Logout (SUCCESS)
```http
POST http://localhost:8085/api/auth/logout
Cookie: ONVENT_SESSION=<session-id>
```
**Expected Result**: 200 OK - "Logout successful"

#### Test 6.2: Access Protected Resource After Logout (FAIL)
```http
GET http://localhost:8085/users/profile
Cookie: ONVENT_SESSION=<old-session-id>
```
**Expected Result**: 401 Unauthorized

### 7. Session Management Tests

#### Test 7.1: Session Timeout
1. Login successfully
2. Wait for 30 minutes (or configured timeout)
3. Try to access protected resource
**Expected Result**: 401 Unauthorized - Session expired

#### Test 7.2: Concurrent Session Control
1. Login from first client (get Session A)
2. Login from second client with same credentials (get Session B)
3. Try to access with Session A
**Expected Result**: Session A should be invalidated

### 8. CSRF Protection Tests

#### Test 8.1: POST Without CSRF Token (Protected Endpoint)
```http
POST http://localhost:8085/events/create
Cookie: ONVENT_SESSION=<admin-session-id>
Content-Type: application/json
```
**Note**: For protected endpoints, CSRF token must be included in headers

#### Test 8.2: Login/Signup Without CSRF (SUCCESS)
Login and signup endpoints are excluded from CSRF protection
```http
POST http://localhost:8085/api/auth/login
Content-Type: application/json

{
  "usernameOrEmail": "testuser",
  "password": "TestPass123"
}
```
**Expected Result**: 200 OK - Works without CSRF token

## Testing with Postman

### Setup:
1. Create a new Postman collection for "Onvent Authentication"
2. Add environment variables:
   - `base_url`: http://localhost:8085
   - `user_session`: (will be set automatically)
   - `admin_session`: (will be set automatically)

### Auto-capture Session Cookie:
Add this to the Tests tab of login requests:
```javascript
if (pm.response.code === 200) {
    const sessionCookie = pm.cookies.get('ONVENT_SESSION');
    pm.environment.set('user_session', sessionCookie);
}
```

### Setting Cookie in Requests:
In the Headers tab:
```
Cookie: ONVENT_SESSION={{user_session}}
```

## Testing with curl

### Example: Register and Login
```bash
# Register
curl -X POST http://localhost:8085/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123"
  }'

# Login and save cookie
curl -X POST http://localhost:8085/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "testuser",
    "password": "TestPass123"
  }' \
  -c cookies.txt

# Access protected resource with cookie
curl -X GET http://localhost:8085/users/profile \
  -b cookies.txt
```

## Expected Security Behaviors

### ✅ Should Allow:
- Public access to event listing
- User registration without authentication
- User login without authentication
- Authenticated users to view/update their own profile
- Authenticated users to book tickets
- Authenticated users to view their own bookings
- Admin users to manage events
- Admin users to view all bookings

### ❌ Should Deny:
- Access to protected resources without authentication
- Regular users creating/updating/deleting events
- Regular users viewing all bookings
- Regular users viewing other users' profiles
- Any user accessing resources after logout
- Requests with invalid credentials
- Weak passwords during registration
- Duplicate usernames or emails

## Troubleshooting

### Issue: Session Cookie Not Set
**Solution**: Ensure `allowCredentials = true` in CORS configuration and frontend sends `credentials: 'include'`

### Issue: 403 Forbidden on Allowed Endpoints
**Solution**: Check user role and @PreAuthorize annotations

### Issue: CSRF Token Errors
**Solution**: Get CSRF token from cookie and include in X-XSRF-TOKEN header for state-changing operations

### Issue: 401 on Every Request
**Solution**: Verify session cookie is being sent with requests

## Test Results Checklist

- [ ] User registration successful
- [ ] Duplicate username/email rejected
- [ ] Weak passwords rejected
- [ ] Login with username works
- [ ] Login with email works
- [ ] Invalid credentials rejected
- [ ] Session cookie created on login
- [ ] Authenticated user can access profile
- [ ] Unauthenticated user cannot access profile
- [ ] USER cannot create events
- [ ] ADMIN can create events
- [ ] USER can book tickets
- [ ] Unauthenticated user cannot book tickets
- [ ] USER cannot view all tickets
- [ ] ADMIN can view all tickets
- [ ] Logout invalidates session
- [ ] Session timeout works
- [ ] CSRF protection enabled for protected endpoints
- [ ] Password is hashed in database (verify manually)

## Performance Testing

### Load Test Scenarios:
1. **Concurrent Logins**: Test 100 concurrent login requests
2. **Session Management**: Verify session handling under load
3. **Authorization Checks**: Measure overhead of role-based access control

### Tools:
- Apache JMeter
- Apache Bench (ab)
- Gatling

## Security Audit

### Manual Checks:
1. Verify passwords are never returned in API responses
2. Check database for BCrypt hashed passwords
3. Verify session cookies have HttpOnly flag
4. Test SQL injection resistance in login forms
5. Test XSS resistance in user input fields
6. Verify rate limiting (if implemented)

## Integration with Frontend

### Required Frontend Changes:
1. Include credentials in all API requests:
   ```javascript
   fetch('http://localhost:8085/api/auth/login', {
     credentials: 'include',
     // ...
   })
   ```

2. Handle authentication state
3. Store user role for UI rendering
4. Implement route guards based on authentication/authorization
5. Handle session expiration gracefully

## Notes
- All timestamps in responses are in UTC
- Session cookie is HTTP-only and cannot be accessed via JavaScript
- CSRF token is required for state-changing operations (except login/signup)
- Default role for new users is USER
- Admin users must be created explicitly with role: "ADMIN"
