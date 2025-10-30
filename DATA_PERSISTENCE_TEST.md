# Data Persistence Test

This document describes how to test that data is preserved across application restarts.

## Test Procedure

1. Start the application
2. Register a new user through the API or UI
3. Create an event through the API or UI
4. Book a ticket for the event
5. Stop the application
6. Start the application again
7. Verify that the user, event, and ticket still exist

## API Endpoints for Testing

### Register a User
```bash
curl -X POST http://localhost:8086/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

### Login
```bash
curl -X POST http://localhost:8086/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "TestPass123!"
  }'
```

### Create an Event (requires authentication)
```bash
curl -X POST http://localhost:8086/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Test Event",
    "description": "This is a test event",
    "location": "Test Location",
    "eventDate": "2025-12-31T20:00:00",
    "price": 25.0,
    "maxAttendees": 100,
    "organizerId": 1
  }'
```

## Expected Results

After restarting the application:
- Users should still exist in the database
- Events should still exist in the database
- Tickets should still exist in the database
- No data should be lost during the restart process

## Verification Queries

You can verify data persistence by running these SQL queries directly against the database:

```sql
-- Check if users exist
SELECT * FROM users;

-- Check if events exist
SELECT * FROM events;

-- Check if tickets exist
SELECT * FROM tickets;
```

## Configuration Summary

The application is configured to preserve data across restarts with:

1. `spring.jpa.hibernate.ddl-auto=validate` - Prevents Hibernate from dropping/creating tables
2. Flyway migrations - Controls database schema changes in a versioned manner
3. PostgreSQL database - Persistent storage that survives application restarts