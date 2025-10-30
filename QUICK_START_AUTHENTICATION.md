# Quick Start Guide - Authentication & Authorization

## 🚀 Getting Started in 5 Minutes

### 1. Start the Application
```bash
cd "c:\Users\Sobani Weerasinghe\OneDrive\Documents\GitHub\Onvent"
mvn spring-boot:run
```

### 2. Create Your First Admin User
```bash
curl -X POST http://localhost:8085/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "name": "Admin User",
    "email": "admin@onvent.com",
    "password": "Admin1234",
    "role": "ADMIN"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:8085/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "admin",
    "password": "Admin1234"
  }' \
  -c cookies.txt
```

### 4. Test Authentication
```bash
curl -X GET http://localhost:8085/users/profile \
  -b cookies.txt
```

## 📋 Essential Endpoints

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/signup` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login |
| POST | `/api/auth/logout` | Auth | Logout |
| GET | `/api/auth/me` | Auth | Get current user |

### User Profile
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/users/profile` | Auth | Get own profile |
| PUT | `/users/profile` | Auth | Update profile |
| GET | `/users/{id}` | Admin | Get user by ID |

### Events
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/events/all` | Public | List all events |
| POST | `/events/create` | Admin | Create event |
| PUT | `/events/update/{id}` | Admin | Update event |
| DELETE | `/events/delete/{id}` | Admin | Delete event |

### Tickets
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/tickets/book` | Auth | Book ticket |
| GET | `/tickets/user/{userId}/bookings` | Auth | View bookings |
| GET | `/tickets/all` | Admin | View all tickets |

## 🔑 User Roles

### USER (Default)
- Browse events
- Book tickets
- View own bookings
- Manage own profile

### ADMIN
- All USER permissions
- Create/Update/Delete events
- View all bookings
- View all users

## 🛡️ Security Features

### Password Requirements
- ✅ Minimum 8 characters
- ✅ At least 1 uppercase letter
- ✅ At least 1 lowercase letter
- ✅ At least 1 digit

### Example Valid Passwords
- `Password123`
- `SecurePass1`
- `Admin1234`

### Example Invalid Passwords
- `password` (no uppercase, no digit)
- `Pass1` (too short)
- `PASSWORD123` (no lowercase)

## 📝 Sample Requests

### Register User
```json
POST /api/auth/signup
{
  "username": "john_doe",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Login
```json
POST /api/auth/login
{
  "usernameOrEmail": "john_doe",
  "password": "SecurePass123"
}
```

### Create Event (Admin)
```json
POST /events/create
{
  "title": "Tech Conference 2025",
  "description": "Annual technology conference",
  "location": "Convention Center",
  "eventDate": "2025-12-15",
  "maxAttendees": 500
}
```

### Book Ticket (User)
```json
POST /tickets/book
{
  "userId": 1,
  "eventId": 1,
  "numberOfSeats": 2
}
```

## 🔧 Frontend Integration

### React/Vue/Angular Example
```javascript
// Login
const login = async (username, password) => {
  const response = await fetch('http://localhost:8085/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Important for cookies!
    body: JSON.stringify({
      usernameOrEmail: username,
      password: password
    })
  });
  
  if (response.ok) {
    const user = await response.json();
    // Store user info in state
    return user;
  }
  throw new Error('Login failed');
};

// Call protected endpoint
const getProfile = async () => {
  const response = await fetch('http://localhost:8085/users/profile', {
    credentials: 'include' // Important for cookies!
  });
  
  if (response.ok) {
    return await response.json();
  }
  throw new Error('Not authenticated');
};

// Logout
const logout = async () => {
  await fetch('http://localhost:8085/api/auth/logout', {
    method: 'POST',
    credentials: 'include'
  });
  // Clear user state
};
```

## ⚠️ Common Issues & Solutions

### Issue: 401 Unauthorized
**Solution**: Make sure you're sending the session cookie with requests
```javascript
fetch(url, { credentials: 'include' })
```

### Issue: 403 Forbidden
**Solution**: Check if your user has the required role
- Regular users cannot create events
- Only admins can view all tickets

### Issue: CORS Error
**Solution**: Verify your frontend origin is configured in `SecurityConfig.java`
```java
configuration.setAllowedOrigins(List.of("http://localhost:5173"));
```

### Issue: Session Expires
**Solution**: Session timeout is 30 minutes. Re-login if expired.

## 🧪 Testing with Postman

1. **Import Collection**: Create a new collection
2. **Set Base URL**: `http://localhost:8085`
3. **Enable Cookies**: Settings → Enable "Automatically follow redirects"
4. **Test Flow**:
   - Signup → Login → Get Profile → Logout

## 📊 HTTP Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful request |
| 201 | Created | User/Event/Booking created |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Not logged in |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Something went wrong |

## 🎯 Quick Validation Checklist

Before deployment, verify:
- [ ] Users can register
- [ ] Users can login
- [ ] Session cookies work
- [ ] Logout invalidates session
- [ ] Users cannot access admin endpoints
- [ ] Admins can manage events
- [ ] Passwords are hashed in database
- [ ] CORS configured correctly

## 📚 More Documentation

- **Complete Guide**: `AUTHENTICATION_SYSTEM_README.md`
- **Testing Guide**: `AUTHENTICATION_TESTING_GUIDE.md`
- **Implementation Details**: `AUTHENTICATION_IMPLEMENTATION_SUMMARY.md`

## 🆘 Need Help?

1. Check the error message
2. Verify request format
3. Check authentication status
4. Review role requirements
5. Consult full documentation

## 🔗 Useful Links

- API Base URL: `http://localhost:8085`
- Health Check: `http://localhost:8085/actuator/health` (if enabled)
- Default Session Timeout: 30 minutes
- Default Cookie Name: `ONVENT_SESSION`

---

**Happy Coding! 🎉**
