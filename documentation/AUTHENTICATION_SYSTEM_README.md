# Authentication & Authorization System Documentation

## Overview
This document describes the secure authentication and authorization system implemented for the Onvent application using Spring Security with session-based authentication.

## Features Implemented

### 1. User Management
- **User Registration (Signup)**: New users can register with unique username and email
- **User Login**: Supports login with both username or email
- **User Logout**: Properly invalidates sessions and clears authentication context
- **Profile Management**: Users can view and update their profiles

### 2. Role-Based Access Control (RBAC)
The system implements two user roles:

#### USER Role Permissions:
- Browse available events (GET /events/*)
- Book tickets for events (POST /tickets/book)
- View their own booking history (GET /tickets/user/{userId}/bookings)
- Cancel their own bookings (DELETE /tickets/{ticketId}/cancel)
- View and update their profile (GET/PUT /users/profile)

#### ADMIN Role Permissions:
- All USER permissions, plus:
- Create events (POST /events/create)
- Update events (PUT /events/update/{id})
- Delete events (DELETE /events/delete/{id})
- View all tickets/bookings (GET /tickets/all)
- Manage tickets (POST/PUT/DELETE /tickets/*)
- View user profiles by ID (GET /users/{id})

### 3. Security Features

#### Password Security:
- BCrypt password hashing with salt
- Minimum password requirements:
  - At least 8 characters long
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one digit
- Passwords are never exposed in API responses (using @JsonProperty)

#### Session Management:
- Cookie-based session authentication
- Session timeout: 30 minutes of inactivity
- HTTP-only cookies to prevent XSS attacks
- Maximum 1 concurrent session per user
- Proper session invalidation on logout

#### CSRF Protection:
- CSRF tokens enabled for all state-changing operations
- Cookie-based CSRF token repository
- Excluded endpoints: /api/auth/signup, /api/auth/login, /api/test/**

#### CORS Configuration:
- Configured for frontend origin: http://localhost:5173
- Credentials allowed for cookie-based authentication
- Allowed methods: GET, POST, PUT, DELETE, OPTIONS

## API Endpoints

### Authentication Endpoints

#### 1. User Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "username": "john_doe",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "USER"  // Optional, defaults to USER
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "username": "john_doe",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER",
  "message": "User registered successfully"
}
```

#### 2. User Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "usernameOrEmail": "john_doe",  // Can be username or email
  "password": "SecurePass123"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "john_doe",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER",
  "message": "Login successful"
}
```

#### 3. User Logout
```http
POST /api/auth/logout
```

**Response (200 OK):**
```json
{
  "message": "Logout successful"
}
```

#### 4. Get Current User
```http
GET /api/auth/me
```

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "john_doe",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER"
}
```

### User Profile Endpoints

#### 1. Get Current User Profile
```http
GET /users/profile
Authorization: Required (USER or ADMIN)
```

#### 2. Update Current User Profile
```http
PUT /users/profile
Authorization: Required (USER or ADMIN)
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

#### 3. Get User by ID (Admin Only)
```http
GET /users/{id}
Authorization: Required (ADMIN)
```

## Security Architecture

### Components

1. **SecurityConfig**: Main security configuration
   - Configures HTTP security
   - Sets up password encoding (BCrypt)
   - Defines authorization rules
   - Configures session management

2. **CustomUserDetailsService**: Implements Spring Security's UserDetailsService
   - Loads user details from database
   - Converts User entity to Spring Security UserDetails
   - Sets user authorities based on roles

3. **AuthController**: Handles authentication operations
   - Signup, login, logout endpoints
   - Session creation and invalidation
   - Current user retrieval

4. **GlobalExceptionHandler**: Centralized exception handling
   - Authentication errors (401)
   - Authorization errors (403)
   - Validation errors (400)
   - Resource not found (404)

### Authentication Flow

1. **Registration**:
   - User submits signup request
   - System validates input (username/email uniqueness, password strength)
   - Password is hashed using BCrypt
   - User saved to database with default USER role

2. **Login**:
   - User submits credentials (username/email + password)
   - AuthenticationManager authenticates using DaoAuthenticationProvider
   - CustomUserDetailsService loads user from database
   - Password verified against BCrypt hash
   - On success: SecurityContext created and stored in session
   - Session cookie (ONVENT_SESSION) sent to client

3. **Authorization**:
   - Each request includes session cookie
   - Spring Security loads SecurityContext from session
   - @PreAuthorize annotations check user roles
   - Access granted/denied based on role

4. **Logout**:
   - Session invalidated
   - SecurityContext cleared
   - Session cookie deleted

## Error Handling

### HTTP Status Codes

- **200 OK**: Successful request
- **201 Created**: Resource created (signup, event creation)
- **400 Bad Request**: Validation errors, invalid input
- **401 Unauthorized**: Authentication required or failed
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Conflict (e.g., insufficient seats)
- **500 Internal Server Error**: Server-side error

### Error Response Format
```json
{
  "error": "Error message description"
}
```

For validation errors:
```json
{
  "username": "Username is required",
  "email": "Email should be valid",
  "password": "Password must be at least 8 characters long"
}
```

## Database Schema Updates

The User entity has been updated with:
- `username` field (unique, required)
- `role` field (enum: USER, ADMIN)
- Validation annotations
- Lombok annotations for cleaner code

## Testing the System

### 1. Create Admin User
```bash
POST http://localhost:8085/api/auth/signup
{
  "username": "admin",
  "name": "Admin User",
  "email": "admin@onvent.com",
  "password": "Admin123",
  "role": "ADMIN"
}
```

### 2. Create Regular User
```bash
POST http://localhost:8085/api/auth/signup
{
  "username": "user1",
  "name": "Test User",
  "email": "user@onvent.com",
  "password": "User1234"
}
```

### 3. Login as Admin
```bash
POST http://localhost:8085/api/auth/login
{
  "usernameOrEmail": "admin",
  "password": "Admin123"
}
```

### 4. Test RBAC
- Try creating an event without authentication → 401 Unauthorized
- Try creating an event as USER → 403 Forbidden
- Try creating an event as ADMIN → 201 Created

## Configuration

### Session Configuration (application.properties)
```properties
# Session timeout (30 minutes)
server.servlet.session.timeout=30m

# HTTP-only cookie (prevents JavaScript access)
server.servlet.session.cookie.http-only=true

# Secure flag (set to true in production with HTTPS)
server.servlet.session.cookie.secure=false

# SameSite policy
server.servlet.session.cookie.same-site=lax

# Custom session cookie name
server.servlet.session.cookie.name=ONVENT_SESSION
```

## Production Considerations

### For Production Deployment:

1. **Enable HTTPS**:
   ```properties
   server.servlet.session.cookie.secure=true
   ```

2. **Update CORS Configuration**:
   - Replace `http://localhost:5173` with production frontend URL
   - Consider using environment variables

3. **Strengthen Password Requirements**:
   - Consider adding special character requirement
   - Implement password history

4. **Add Rate Limiting**:
   - Prevent brute force attacks on login endpoint

5. **Implement Account Lockout**:
   - Lock account after X failed login attempts

6. **Add Remember Me** (Optional):
   - For persistent login sessions

7. **Implement JWT** (Alternative):
   - For stateless authentication in microservices

## Additional Security Enhancements

### Implemented:
✅ BCrypt password hashing
✅ Session-based authentication
✅ CSRF protection
✅ Role-based access control
✅ HTTP-only cookies
✅ Session timeout
✅ Password validation
✅ Concurrent session control
✅ Proper logout

### Future Enhancements:
- Two-factor authentication (2FA)
- OAuth2 integration (Google, GitHub)
- Password reset via email
- Email verification on signup
- Account lockout after failed attempts
- Audit logging for security events
- API rate limiting

## Troubleshooting

### Common Issues:

1. **401 Unauthorized on protected endpoints**:
   - Ensure you're logged in
   - Check session cookie is being sent
   - Verify session hasn't expired

2. **403 Forbidden**:
   - Check user role permissions
   - Ensure endpoint allows your role

3. **CSRF token errors**:
   - Frontend must include CSRF token in requests
   - Check CSRF cookie is present

4. **CORS errors**:
   - Verify frontend origin matches CORS configuration
   - Ensure credentials are included in requests

## Support

For issues or questions, please refer to:
- Spring Security Documentation
- Project README
- Development team
