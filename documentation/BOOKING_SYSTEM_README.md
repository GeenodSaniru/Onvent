# Ticket Booking System - Documentation

## Overview

This document provides comprehensive documentation for the ticket booking system implemented in the Onvent application. The system enables authenticated users to book tickets for available events with real-time seat availability validation, view their bookings in a dashboard, and cancel bookings.

## Features Implemented

### 1. **Ticket Booking with Seat Validation**
- Real-time seat availability checking before booking confirmation
- Prevents overbooking by validating available seats
- Automatic ticket code generation (format: `TKT-XXXXXXXX`)
- Prevents booking for past events
- Transaction support to ensure data consistency

### 2. **Real-time Availability Check**
- Live seat availability display showing:
  - Total event capacity
  - Number of booked seats
  - Number of available seats
  - Visual indicators (color-coded):
    - Green: Available seats
    - Yellow: Limited seats (< 10 remaining)
    - Red: Sold out

### 3. **User Dashboard**
- View all active bookings for the logged-in user
- Display comprehensive booking information:
  - Event details (title, date, location, price)
  - Ticket code
  - Purchase date
  - Current availability status
- Cancel individual bookings
- Booking status indicators (ACTIVE/CANCELLED)

### 4. **RESTful API Endpoints**

#### Booking Operations

**Book a Ticket**
```
POST /tickets/book
Content-Type: application/json

Request Body:
{
  "userId": 1,
  "eventId": 2,
  "numberOfTickets": 1
}

Response (201 Created):
{
  "ticketId": 15,
  "ticketCode": "TKT-A3B4C5D6",
  "userId": 1,
  "userName": "John Doe",
  "eventId": 2,
  "eventTitle": "Tech Conference 2025",
  "eventLocation": "Convention Center",
  "eventDate": "2025-12-15T09:00:00",
  "eventPrice": 150.00,
  "purchaseDate": "2025-10-16T10:30:00",
  "status": "ACTIVE",
  "availableSeats": 49
}
```

**Check Seat Availability**
```
GET /tickets/availability/{eventId}

Response (200 OK):
{
  "eventId": 2,
  "eventTitle": "Tech Conference 2025",
  "maxAttendees": 100,
  "bookedSeats": 51,
  "availableSeats": 49,
  "isAvailable": true
}
```

**Get User Bookings**
```
GET /tickets/user/{userId}/bookings

Response (200 OK):
[
  {
    "ticketId": 15,
    "ticketCode": "TKT-A3B4C5D6",
    "userId": 1,
    "userName": "John Doe",
    "eventId": 2,
    "eventTitle": "Tech Conference 2025",
    "eventLocation": "Convention Center",
    "eventDate": "2025-12-15T09:00:00",
    "eventPrice": 150.00,
    "purchaseDate": "2025-10-16T10:30:00",
    "status": "ACTIVE",
    "availableSeats": 49
  }
]
```

**Cancel a Booking**
```
DELETE /tickets/{ticketId}/cancel?userId={userId}

Response (200 OK):
{
  "message": "Booking cancelled successfully"
}
```

#### Error Responses

**404 Not Found** - User or Event not found
```json
{
  "error": "Event not found with ID: 2"
}
```

**409 Conflict** - Insufficient seats
```json
{
  "error": "Insufficient seats available. Available: 0, Requested: 1"
}
```

**400 Bad Request** - Invalid booking request
```json
{
  "error": "Cannot book tickets for past events"
}
```

## Backend Architecture

### Entities

**Ticket Entity** (`Ticket.java`)
- Added `status` field with enum (ACTIVE, CANCELLED)
- Bidirectional relationships with User and Event entities
- Automatic status setting to ACTIVE on creation

### DTOs (Data Transfer Objects)

1. **BookingRequest** - Input for booking tickets
   - userId (Long)
   - eventId (Long)
   - numberOfTickets (Integer)

2. **BookingResponse** - Complete booking information
   - All ticket and event details
   - Current availability status
   - User information

3. **AvailabilityResponse** - Real-time seat availability
   - Event capacity details
   - Booked/available seat counts
   - Availability status

### Repository Layer

**TicketRepository** - Custom queries added:
- `findActiveTicketsByUserId()` - Get all active tickets for a user
- `countActiveTicketsByEventId()` - Count active bookings for an event
- `findActiveTicketsByEventId()` - Get all active tickets for an event
- `existsActiveTicketByUserIdAndEventId()` - Check if user has active ticket

### Service Layer

**TicketService** - Enhanced with:
- `bookTicket()` - Book tickets with comprehensive validation
- `checkAvailability()` - Real-time availability checking
- `getUserBookings()` - Retrieve user's active bookings
- `cancelBooking()` - Cancel a booking with ownership verification
- Transaction management with `@Transactional`

### Controller Layer

**TicketController** - RESTful endpoints:
- `POST /tickets/book` - Book a ticket
- `GET /tickets/availability/{eventId}` - Check availability
- `GET /tickets/user/{userId}/bookings` - Get user bookings
- `DELETE /tickets/{ticketId}/cancel` - Cancel booking
- Comprehensive error handling with appropriate HTTP status codes

### Exception Handling

Custom exceptions created:
- **InsufficientSeatsException** - Thrown when requested seats exceed availability
- **ResourceNotFoundException** - Thrown when user/event not found
- **InvalidBookingException** - Thrown for invalid booking operations

## Frontend Components

### 1. **UserDashboard Component** (`UserDashboard.jsx`)

Features:
- User ID authentication (stored in localStorage)
- Display all active bookings in a responsive grid
- Real-time booking cancellation
- Color-coded status badges
- Formatted date/time display
- Responsive design for mobile devices

Key Functions:
- `fetchBookings()` - Load user's bookings
- `handleCancelBooking()` - Cancel a specific booking
- Confirmation dialog before cancellation

### 2. **Enhanced TicketBooking Component** (`TicketBooking.jsx`)

Features:
- Event selection dropdown with event details
- Real-time seat availability check on event selection
- Visual availability indicators:
  - Total capacity, booked seats, available seats
  - Color-coded availability status
  - Dynamic ticket quantity selector
- Auto-disable booking when sold out
- User ID persistence in localStorage
- Comprehensive error handling

Key Functions:
- `checkAvailability()` - Real-time availability check
- `handleEventChange()` - Trigger availability check on event selection
- `handleSubmit()` - Book ticket with validation

### 3. **Updated Services** (`ticketService.js`)

New methods added:
- `bookTicket()` - Book tickets via new API
- `checkAvailability()` - Check event availability
- `getUserBookings()` - Get user's bookings
- `cancelBooking()` - Cancel a booking

### 4. **Navigation Updates**

**Layout Component** - Updated navigation:
- "Book Tickets" - Direct link to booking page
- "My Bookings" - Dashboard link
- Improved navigation structure

**App.jsx** - New route added:
- `/dashboard` - User dashboard route

## Database Schema

The ticket status is stored as a VARCHAR enum in the database:

```sql
ALTER TABLE tickets ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE';
```

Valid values: `ACTIVE`, `CANCELLED`

## Validation Rules

### Booking Validation:
1. User ID and Event ID are required
2. Number of tickets must be greater than 0
3. Event must not have already occurred
4. Sufficient seats must be available
5. Seats are validated within a transaction to prevent race conditions

### Cancellation Validation:
1. Ticket must exist
2. User must own the ticket
3. Ticket must not already be cancelled
4. Event must not have already occurred

## Usage Guide

### For Users:

1. **View Available Events**
   - Navigate to "Events" to see all available events
   - Check event details, dates, and pricing

2. **Book a Ticket**
   - Go to "Book Tickets"
   - Enter your User ID (will be saved for future use)
   - Select an event from the dropdown
   - View real-time seat availability
   - Click "Book Ticket" to confirm

3. **View Your Bookings**
   - Navigate to "My Bookings"
   - View all your active bookings
   - See ticket codes, event details, and status

4. **Cancel a Booking**
   - Go to "My Bookings"
   - Find the booking you want to cancel
   - Click "Cancel Booking"
   - Confirm the cancellation

### For Developers:

1. **Running the Backend**
```bash
cd /path/to/Onvent
./mvnw spring-boot:run
```

2. **Running the Frontend**
```bash
cd frontend/onvent-frontend
npm install
npm run dev
```

3. **Testing the API**
Use tools like Postman or curl to test the endpoints:

```bash
# Check availability
curl http://localhost:8080/tickets/availability/1

# Book a ticket
curl -X POST http://localhost:8080/tickets/book \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"eventId":1,"numberOfTickets":1}'

# Get user bookings
curl http://localhost:8080/tickets/user/1/bookings

# Cancel booking
curl -X DELETE "http://localhost:8080/tickets/1/cancel?userId=1"
```

## Security Considerations

Current Implementation:
- Basic authentication disabled for development
- All ticket endpoints are publicly accessible
- User ID is passed as a parameter (not from session)

**Recommended Enhancements for Production:**
1. Implement JWT or session-based authentication
2. Extract user ID from authenticated session
3. Add role-based access control (RBAC)
4. Enable CSRF protection
5. Add rate limiting for booking endpoints
6. Implement booking expiration (hold seats temporarily)

## Performance Optimizations

1. **Database Indexing:**
   - Index on `ticket.status` for faster queries
   - Composite index on `(event_id, status)` for availability checks

2. **Caching:**
   - Cache event availability data with TTL
   - Invalidate cache on booking/cancellation

3. **Lazy Loading:**
   - Entity relationships use LAZY fetch type
   - Prevents N+1 query problems

4. **Transaction Management:**
   - `@Transactional` ensures atomic operations
   - Prevents race conditions in booking

## Testing Recommendations

### Unit Tests:
1. Test TicketService booking logic
2. Test validation rules
3. Test cancellation logic
4. Test availability calculations

### Integration Tests:
1. Test complete booking flow
2. Test concurrent booking scenarios
3. Test error handling
4. Test database transactions

### Frontend Tests:
1. Test component rendering
2. Test API integration
3. Test user interactions
4. Test error states

## Troubleshooting

### Common Issues:

1. **"Ticket not found" error**
   - Ensure the ticket ID exists and belongs to the user

2. **"Insufficient seats" error**
   - Event is fully booked or requested quantity exceeds availability

3. **"Cannot book tickets for past events"**
   - Check event date is in the future

4. **Frontend shows stale data**
   - Refresh the page or implement WebSocket for real-time updates

## Future Enhancements

1. **Payment Integration:**
   - Integrate payment gateway
   - Hold seats during payment process

2. **Email Notifications:**
   - Send booking confirmation emails
   - Send cancellation confirmations

3. **QR Code Generation:**
   - Generate unique QR codes for tickets
   - Enable mobile ticket scanning

4. **Booking History:**
   - View cancelled bookings
   - Export booking history

5. **Multi-ticket Booking:**
   - Extend to support multiple tickets in single transaction
   - Group booking management

6. **Waitlist Feature:**
   - Add users to waitlist when sold out
   - Notify when seats become available

7. **Real-time Updates:**
   - WebSocket integration for live availability updates
   - Push notifications for booking status changes

## API Documentation

Complete API documentation is available via Swagger/OpenAPI at:
- **URL:** `http://localhost:8080/swagger-ui.html` (if configured)

## Support

For issues or questions:
- Check the logs in `logs/` directory
- Review the TESTING_GUIDE.md for test scenarios
- Contact the development team

## License

This booking system is part of the Onvent application and follows the same license terms.
