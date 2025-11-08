# Onvent Testing Guide

This guide explains how to test the full CRUD (Create, Read, Update, Delete) flows for the Onvent application through the frontend.

## Prerequisites

1. Backend server running on `http://localhost:8085`
2. Frontend application running on `http://localhost:5174`
3. Database properly configured and accessible

## Testing the Full CRUD Flows

### 1. User Management

#### Create a User
1. Navigate to `http://localhost:5174/register`
2. Fill in the user registration form:
   - Name: John Doe
   - Email: john@example.com
   - Password: password123
3. Click "Register"
4. You should see a success message

#### View Users
1. Navigate to `http://localhost:5174/users`
2. You should see a list of all users including the one you just created

#### Update a User
1. Currently, there's no direct UI for updating users
2. You can test this via the API directly or through the CRUD test

#### Delete a User
1. On the User List page (`/users`), click the "Delete" button next to a user
2. The user should be removed from the list

### 2. Event Management

#### Create an Event
1. Navigate to `http://localhost:5174/events/create`
2. Fill in the event creation form:
   - Title: Test Event
   - Description: This is a test event
   - Location: Test Location
   - Event Date: Choose a future date/time
   - Price: 25.99
   - Max Attendees: 100
   - Organizer ID: Use an existing user ID from the User List
3. Click "Create Event"
4. You should see a success message

#### View Events
1. Navigate to `http://localhost:5174/events`
2. You should see a list of all events including the one you just created

#### Update an Event
1. Currently, there's no direct UI for updating events
2. You can test this via the API directly or through the CRUD test

#### Delete an Event
1. On the Event List page (`/events`), click the "Delete" button next to an event
2. The event should be removed from the list

### 3. Ticket Management

#### Book a Ticket
1. Navigate to `http://localhost:5174/tickets/book`
2. Fill in the ticket booking form:
   - Purchase Date: Current date/time (default)
   - Ticket Code: Leave blank to auto-generate or enter a custom code
   - User ID: Use an existing user ID
   - Event ID: Use an existing event ID
3. Click "Book Ticket"
4. You should see a success message

#### View Tickets
1. Navigate to `http://localhost:5174/tickets`
2. You should see a list of all tickets including the one you just booked

#### Update a Ticket
1. Currently, there's no direct UI for updating tickets
2. You can test this via the API directly or through the CRUD test

#### Delete a Ticket
1. On the Ticket View page (`/tickets`), click the "Delete" button next to a ticket
2. The ticket should be removed from the list

## Automated Testing

### API Connection Test
1. Navigate to `http://localhost:5174/test`
2. Click "Test APIs Again"
3. You should see success messages for all three APIs (Users, Events, Tickets)

### Full CRUD Test
1. Navigate to `http://localhost:5174/crud-test`
2. Click "Run Full CRUD Test"
3. Watch as the system automatically:
   - Creates a user
   - Retrieves the user
   - Creates an event
   - Retrieves the event
   - Books a ticket
   - Retrieves the ticket
   - Updates the user
   - Updates the event
   - Updates the ticket
   - Deletes the ticket
   - Deletes the event
   - Deletes the user
4. All tests should show as "Success" when completed

## Manual API Testing

You can also test the APIs directly using tools like Postman or curl:

### Users API
- Create: POST http://localhost:8085/users/create
- Get All: GET http://localhost:8085/users/all
- Get One: GET http://localhost:8085/users/{id}
- Update: PUT http://localhost:8085/users/update/{id}
- Delete: DELETE http://localhost:8085/users/delete/{id}

### Events API
- Create: POST http://localhost:8085/events/create
- Get All: GET http://localhost:8085/events/all
- Get One: GET http://localhost:8085/events/{id}
- Update: PUT http://localhost:8085/events/update/{id}
- Delete: DELETE http://localhost:8085/events/delete/{id}

### Tickets API
- Create: POST http://localhost:8085/tickets/create
- Get All: GET http://localhost:8085/tickets/all
- Get One: GET http://localhost:8085/tickets/{id}
- Update: PUT http://localhost:8085/tickets/update/{id}
- Delete: DELETE http://localhost:8085/tickets/delete/{id}

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure the backend is configured to allow requests from the frontend origin
2. **Connection Refused**: Ensure the backend server is running on port 8085
3. **Database Connection Issues**: Verify database credentials in application.properties
4. **404 Errors**: Check that the backend endpoints are correctly implemented

### Checking Backend Status

1. Visit `http://localhost:8085/users/all` in your browser
2. You should see a JSON response with user data or an empty array
3. If you get an error, check the backend server logs

## Next Steps

1. Implement update functionality in the UI for all entities
2. Add form validation and error handling
3. Implement proper authentication and authorization
4. Add search and filtering capabilities
5. Improve the UI/UX design