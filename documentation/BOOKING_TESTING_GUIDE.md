# Booking System Testing Guide

## Quick Start Testing

This guide provides step-by-step instructions to test the ticket booking system.

## Prerequisites

1. Backend server running on `http://localhost:8080`
2. Frontend server running on `http://localhost:5173` (or your Vite dev server port)
3. Database with sample users and events

## Test Scenarios

### Scenario 1: Complete Booking Flow (Happy Path)

#### Step 1: Create a Test User
```bash
curl -X POST http://localhost:8080/users/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```
**Expected:** User created with ID (e.g., ID: 1)

#### Step 2: Create a Test Event
```bash
curl -X POST http://localhost:8080/events/create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tech Conference 2025",
    "description": "Annual technology conference",
    "location": "Convention Center",
    "eventDate": "2025-12-15T09:00:00",
    "price": 150.00,
    "maxAttendees": 100,
    "organizer": {"id": 1}
  }'
```
**Expected:** Event created with ID (e.g., ID: 1)

#### Step 3: Check Seat Availability
```bash
curl http://localhost:8080/tickets/availability/1
```
**Expected Response:**
```json
{
  "eventId": 1,
  "eventTitle": "Tech Conference 2025",
  "maxAttendees": 100,
  "bookedSeats": 0,
  "availableSeats": 100,
  "isAvailable": true
}
```

#### Step 4: Book a Ticket
```bash
curl -X POST http://localhost:8080/tickets/book \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "eventId": 1,
    "numberOfTickets": 1
  }'
```
**Expected Response:** (HTTP 201 Created)
```json
{
  "ticketId": 1,
  "ticketCode": "TKT-XXXXXXXX",
  "userId": 1,
  "userName": "John Doe",
  "eventId": 1,
  "eventTitle": "Tech Conference 2025",
  "eventLocation": "Convention Center",
  "eventDate": "2025-12-15T09:00:00",
  "eventPrice": 150.00,
  "purchaseDate": "2025-10-16T...",
  "status": "ACTIVE",
  "availableSeats": 99
}
```

#### Step 5: Verify Availability Updated
```bash
curl http://localhost:8080/tickets/availability/1
```
**Expected:** `bookedSeats: 1`, `availableSeats: 99`

#### Step 6: Get User Bookings
```bash
curl http://localhost:8080/tickets/user/1/bookings
```
**Expected:** Array with 1 booking

#### Step 7: Cancel the Booking
```bash
curl -X DELETE "http://localhost:8080/tickets/1/cancel?userId=1"
```
**Expected Response:**
```json
{
  "message": "Booking cancelled successfully"
}
```

#### Step 8: Verify Booking Cancelled
```bash
curl http://localhost:8080/tickets/user/1/bookings
```
**Expected:** Empty array (no active bookings)

---

### Scenario 2: Test Insufficient Seats

#### Step 1: Create Event with Limited Seats
```bash
curl -X POST http://localhost:8080/events/create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Small Workshop",
    "description": "Limited seats workshop",
    "location": "Room 101",
    "eventDate": "2025-11-20T14:00:00",
    "price": 50.00,
    "maxAttendees": 2,
    "organizer": {"id": 1}
  }'
```
**Expected:** Event with ID 2

#### Step 2: Book 2 Tickets (Fill all seats)
```bash
# First ticket
curl -X POST http://localhost:8080/tickets/book \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "eventId": 2, "numberOfTickets": 1}'

# Second ticket (create another user first)
curl -X POST http://localhost:8080/users/create \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Smith", "email": "jane@example.com", "password": "pass123"}'

curl -X POST http://localhost:8080/tickets/book \
  -H "Content-Type: application/json" \
  -d '{"userId": 2, "eventId": 2, "numberOfTickets": 1}'
```

#### Step 3: Try to Book When Sold Out
```bash
curl -X POST http://localhost:8080/tickets/book \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "eventId": 2, "numberOfTickets": 1}'
```
**Expected Response:** (HTTP 409 Conflict)
```json
{
  "error": "Insufficient seats available. Available: 0, Requested: 1"
}
```

---

### Scenario 3: Test Past Event Booking Prevention

#### Step 1: Create Past Event
```bash
curl -X POST http://localhost:8080/events/create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Past Event",
    "description": "This event already happened",
    "location": "Old Venue",
    "eventDate": "2023-01-01T10:00:00",
    "price": 25.00,
    "maxAttendees": 50,
    "organizer": {"id": 1}
  }'
```

#### Step 2: Try to Book Ticket for Past Event
```bash
curl -X POST http://localhost:8080/tickets/book \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "eventId": 3, "numberOfTickets": 1}'
```
**Expected Response:** (HTTP 400 Bad Request)
```json
{
  "error": "Cannot book tickets for past events"
}
```

---

### Scenario 4: Test Invalid User/Event

#### Test Non-existent User
```bash
curl -X POST http://localhost:8080/tickets/book \
  -H "Content-Type: application/json" \
  -d '{"userId": 9999, "eventId": 1, "numberOfTickets": 1}'
```
**Expected Response:** (HTTP 404 Not Found)
```json
{
  "error": "User not found with ID: 9999"
}
```

#### Test Non-existent Event
```bash
curl -X POST http://localhost:8080/tickets/book \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "eventId": 9999, "numberOfTickets": 1}'
```
**Expected Response:** (HTTP 404 Not Found)
```json
{
  "error": "Event not found with ID: 9999"
}
```

---

### Scenario 5: Test Unauthorized Cancellation

#### Step 1: User 1 Books a Ticket
```bash
curl -X POST http://localhost:8080/tickets/book \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "eventId": 1, "numberOfTickets": 1}'
```
**Note the ticketId** (e.g., ticketId: 5)

#### Step 2: User 2 Tries to Cancel User 1's Booking
```bash
curl -X DELETE "http://localhost:8080/tickets/5/cancel?userId=2"
```
**Expected Response:** (HTTP 400 Bad Request)
```json
{
  "error": "You can only cancel your own bookings"
}
```

---

## Frontend Testing

### Test 1: Book Ticket via UI

1. Open browser: `http://localhost:5173`
2. Navigate to "Book Tickets"
3. Enter User ID: 1
4. Select an event from dropdown
5. Observe real-time availability display
6. Click "Book Ticket"
7. Verify success message with ticket code

### Test 2: View Dashboard

1. Navigate to "My Bookings"
2. Enter User ID: 1
3. View all active bookings
4. Verify booking details are displayed correctly

### Test 3: Cancel Booking

1. In "My Bookings" dashboard
2. Find an active booking
3. Click "Cancel Booking"
4. Confirm cancellation
5. Verify booking disappears from list

### Test 4: Real-time Availability

1. Navigate to "Book Tickets"
2. Select different events
3. Observe availability changing
4. Check color indicators:
   - Green: Good availability
   - Yellow: Limited seats
   - Red: Sold out

### Test 5: Sold Out Event

1. Create event with 1 seat
2. Book that seat
3. Try to book again
4. Verify "SOLD OUT" badge appears
5. Verify "Book Ticket" button is disabled

---

## Database Verification

### Check Ticket Status
```sql
SELECT id, ticket_code, status, user_id, event_id 
FROM tickets;
```

### Check Active Bookings for Event
```sql
SELECT COUNT(*) as active_bookings 
FROM tickets 
WHERE event_id = 1 AND status = 'ACTIVE';
```

### Check User's Bookings
```sql
SELECT t.id, t.ticket_code, t.status, e.title, e.event_date
FROM tickets t
JOIN events e ON t.event_id = e.id
WHERE t.user_id = 1 AND t.status = 'ACTIVE';
```

---

## Performance Testing

### Concurrent Booking Test

Use a tool like Apache JMeter or create a simple script:

```bash
#!/bin/bash
# Concurrent booking test - 10 simultaneous requests

for i in {1..10}; do
  curl -X POST http://localhost:8080/tickets/book \
    -H "Content-Type: application/json" \
    -d "{\"userId\": 1, \"eventId\": 1, \"numberOfTickets\": 1}" &
done
wait

# Check how many bookings succeeded
curl http://localhost:8080/tickets/availability/1
```

**Expected:** Only available seats should be booked, rest should fail with insufficient seats error.

---

## Troubleshooting

### Issue: "CORS error" in browser
**Solution:** Verify `@CrossOrigin` is present in controllers

### Issue: 500 Internal Server Error
**Solution:** Check server logs for stack traces
```bash
# Check logs
tail -f logs/spring-boot-application.log
```

### Issue: Stale availability data
**Solution:** Refresh the page or clear browser cache

### Issue: Database constraint violations
**Solution:** Ensure foreign keys (user_id, event_id) reference valid records

---

## Test Data Cleanup

```sql
-- Clean all test data
DELETE FROM tickets;
DELETE FROM events;
DELETE FROM users;

-- Reset auto-increment
ALTER TABLE tickets AUTO_INCREMENT = 1;
ALTER TABLE events AUTO_INCREMENT = 1;
ALTER TABLE users AUTO_INCREMENT = 1;
```

---

## Automated Testing

### Run Backend Tests
```bash
./mvnw test
```

### Expected Test Coverage
- Service layer: 80%+
- Repository layer: 70%+
- Controller layer: 75%+

---

## Monitoring

### Key Metrics to Monitor

1. **Response Times:**
   - Booking endpoint: < 500ms
   - Availability check: < 200ms
   - User bookings: < 300ms

2. **Error Rates:**
   - Keep below 1% for production

3. **Database Queries:**
   - Monitor for N+1 queries
   - Check query execution times

---

## Success Criteria

✅ All test scenarios pass
✅ No compilation errors
✅ No database constraint violations
✅ Frontend displays data correctly
✅ Real-time availability works
✅ Concurrent bookings handled correctly
✅ Proper error messages displayed

---

## Next Steps

After successful testing:
1. Review security considerations
2. Add authentication/authorization
3. Implement payment integration
4. Add email notifications
5. Deploy to staging environment

---

For questions or issues, refer to BOOKING_SYSTEM_README.md
