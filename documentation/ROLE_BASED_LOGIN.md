# Role-Based Login Implementation

## Overview
This document describes the implementation of a role-based login system where users are redirected to different dashboards based on their roles after successful authentication.

## Implementation Details

### Backend (Spring Boot)

#### Authentication Flow
1. User submits login credentials to `/api/auth/login`
2. Spring Security authenticates the user
3. AuthController returns user details including role (USER or ADMIN)
4. Session is created and user is authenticated

#### Key Components
- **AuthController**: Handles login requests and returns user role in response
- **SecurityConfig**: Configures security rules and permits access to auth endpoints
- **User Entity**: Contains Role enum (USER, ADMIN)

### Frontend (React)

#### Login Process
1. User submits credentials via UserLogin component
2. On successful authentication, role is stored in localStorage
3. User is redirected based on role:
   - ADMIN → `/admin/dashboard`
   - USER → `/user/home`

#### Navigation
- Layout component dynamically shows navigation items based on user role
- Admin users see admin-specific links (Create Event, Manage Users)
- Regular users see user-specific links

#### Components Created
1. **UserLogin.jsx**: Updated to handle role-based redirection
2. **AdminDashboard.jsx**: Dashboard for admin users
3. **UserHome.jsx**: Dashboard for regular users
4. **Layout.jsx**: Updated to show role-specific navigation

## How It Works

### 1. Login Flow
```javascript
// UserLogin.jsx
const response = await api.post('/api/auth/login', credentials);
if (response.status === 200) {
  localStorage.setItem('userRole', response.data.role);
  // Redirect based on role
  if (response.data.role === 'ADMIN') {
    navigate('/admin/dashboard');
  } else {
    navigate('/user/home');
  }
}
```

### 2. Role-Based Navigation
```javascript
// Layout.jsx
{userRole === 'ADMIN' ? (
  <>
    <li><Link to="/admin/dashboard">Admin Dashboard</Link></li>
    <li><Link to="/events/create">Create Event</Link></li>
    <li><Link to="/users">Manage Users</Link></li>
  </>
) : (
  <li><Link to="/user/home">My Dashboard</Link></li>
)}
```

### 3. Persistent Authentication State
```javascript
// Layout.jsx
useEffect(() => {
  const checkAuthStatus = async () => {
    try {
      const response = await api.get('/api/auth/me');
      if (response.status === 200) {
        setIsLoggedIn(true);
        setUserRole(response.data.role);
        localStorage.setItem('userRole', response.data.role);
      }
    } catch (error) {
      // Handle unauthenticated state
    }
  };
}, []);
```

## Routes Configuration

### New Routes Added
- `/admin/dashboard` → AdminDashboard component
- `/user/home` → UserHome component

### Updated Routes
- `/login` → Now uses role-based redirection

## Security Considerations

### Frontend
- Role information is stored in localStorage for UI rendering
- Actual authorization is handled by backend APIs
- Navigation shows appropriate links based on role

### Backend
- Spring Security handles actual authorization
- API endpoints are protected based on roles
- Session management ensures secure authentication

## Testing the Implementation

### Admin User Flow
1. Navigate to `/login`
2. Enter admin credentials
3. Should be redirected to `/admin/dashboard`
4. Navigation should show admin-specific links

### Regular User Flow
1. Navigate to `/login`
2. Enter regular user credentials
3. Should be redirected to `/user/home`
4. Navigation should show user-specific links

## Future Enhancements

### Possible Improvements
1. Add role-based access control for routes using React Router
2. Implement more detailed admin features
3. Add user profile management
4. Implement role-based content filtering
5. Add loading states during authentication checks