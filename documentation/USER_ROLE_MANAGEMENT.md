# User Role Management Guide

## Overview
This document explains how to add or modify user roles in the Onvent application, specifically how to assign admin privileges to users.

## Methods to Add Admin Role

### 1. Direct Database Update (Quick Method)

For immediate role changes, you can directly update the database:

```sql
UPDATE users 
SET role = 'ADMIN' 
WHERE username = 'target_username';
```

Or using the user ID:
```sql
UPDATE users 
SET role = 'ADMIN' 
WHERE id = user_id;
```

To remove admin role:
```sql
UPDATE users 
SET role = 'USER' 
WHERE id = user_id;
```

### 2. Through Admin Dashboard UI

Admin users can manage roles through the web interface:

1. Navigate to the "Manage Users" section from the admin dashboard
2. View the list of all users with their current roles
3. Click "Make Admin" to promote a user to admin
4. Click "Remove Admin" to demote an admin to regular user

### 3. Using API Endpoints

Admin users can also use the REST API directly:

#### Assign Admin Role
```
PUT /users/{userId}/assign-admin
```

#### Remove Admin Role
```
PUT /users/{userId}/remove-admin
```

Both endpoints require admin authentication.

### 4. Programmatic Approach

#### Backend Services

Two new methods were added to the UserService:

1. **assignAdminRole(Long id)** - Promotes a user to admin
2. **removeAdminRole(Long id)** - Demotes an admin to regular user

These methods are secured with `@PreAuthorize("hasRole('ADMIN')")` annotations.

#### Controller Endpoints

New endpoints were added to the UserController:

1. **PUT /users/{id}/assign-admin** - Assigns admin role to user
2. **PUT /users/{id}/remove-admin** - Removes admin role from user

### 5. Special Admin Registration

For creating new admin users, a special endpoint is available:

```
POST /api/auth/admin-signup
```

This endpoint:
- Requires admin authentication
- Forces the role to ADMIN regardless of request data
- Creates a new admin user account

## Implementation Details

### Backend Components

1. **UserService.java**:
   - Added `assignAdminRole()` method
   - Added `removeAdminRole()` method

2. **UserController.java**:
   - Added `/assign-admin` endpoint
   - Added `/remove-admin` endpoint

3. **AuthController.java**:
   - Added `/admin-signup` endpoint for creating admin users

### Frontend Components

1. **UserManagement.jsx**:
   - Displays list of all users
   - Provides UI for role management
   - Shows role badges (ADMIN/USER)
   - Includes action buttons for role changes

2. **Layout.jsx**:
   - Added navigation link to User Management for admin users

3. **App.jsx**:
   - Added route for UserManagement component

4. **App.css**:
   - Added styling for user management interface
   - Added role badge styles
   - Added button styles for role actions

## Security Considerations

1. **Authorization**: All role management endpoints are protected and require ADMIN role
2. **Data Integrity**: Role changes are logged through database transactions
3. **UI Access**: Only admin users can access the user management interface
4. **API Security**: All endpoints use the existing authentication mechanism

## Testing Role Management

### Prerequisites
1. You must be logged in as an admin user
2. You must know the user ID or username of the target user

### Testing Steps

1. **Via Admin Dashboard**:
   - Log in as admin
   - Navigate to "Manage Users"
   - Find target user in the list
   - Click appropriate action button

2. **Via API**:
   - Obtain admin authentication token/session
   - Send PUT request to appropriate endpoint
   - Verify response and user role change

3. **Via Database**:
   - Connect to database
   - Execute UPDATE query
   - Verify role change in application

## Role-Based Access Control

### Admin Privileges
Users with ADMIN role can:
- Manage other users' roles
- Create and manage events
- View all bookings
- Access admin dashboard
- Create other admin users

### User Privileges
Regular users can:
- Book tickets for events
- View their own bookings
- Update their profile
- Access user dashboard

## Troubleshooting

### Common Issues

1. **Insufficient Permissions**:
   - Error: 403 Forbidden
   - Solution: Ensure you're logged in as admin

2. **User Not Found**:
   - Error: 404 Not Found
   - Solution: Verify user ID exists

3. **Database Connection**:
   - Error: Database connection failed
   - Solution: Check database configuration

### Logs and Monitoring

Role changes are automatically logged through:
- Database transaction logs
- Application logs (if enabled)
- Audit trails (if implemented)

## Best Practices

1. **Limit Admin Users**: Only create admin accounts for trusted personnel
2. **Regular Audits**: Periodically review admin user accounts
3. **Secure Credentials**: Use strong passwords for admin accounts
4. **Monitor Activity**: Keep track of admin actions
5. **Backup Data**: Always backup before making direct database changes