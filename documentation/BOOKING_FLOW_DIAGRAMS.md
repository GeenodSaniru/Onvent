# Booking System Flow Diagrams

## 1. Ticket Booking Flow

```mermaid
graph TB
    A[User Visits Book Tickets Page] --> B[Enter User ID]
    B --> C[Select Event from Dropdown]
    C --> D[Check Availability API Call]
    D --> E{Seats Available?}
    E -->|Yes| F[Display Availability Stats]
    E -->|No| G[Show SOLD OUT Badge]
    F --> H[User Clicks Book Ticket]
    G --> I[Disable Book Button]
    H --> J[Validate Request]
    J --> K{Valid?}
    K -->|No| L[Show Error Message]
    K -->|Yes| M[Check Seats Again in Transaction]
    M --> N{Still Available?}
    N -->|No| O[Return Insufficient Seats Error]
    N -->|Yes| P[Create Ticket Record]
    P --> Q[Generate Ticket Code]
    Q --> R[Save to Database]
    R --> S[Return Booking Response]
    S --> T[Show Success Message]
    T --> U[Display Ticket Code]
```

## 2. Availability Check Flow

```mermaid
graph TB
    A[User Selects Event] --> B[API: GET /tickets/availability/eventId]
    B --> C[Fetch Event Details]
    C --> D[Count Active Tickets for Event]
    D --> E[Calculate Available Seats]
    E --> F[maxAttendees - activeBookings]
    F --> G[Build Availability Response]
    G --> H[Return to Frontend]
    H --> I{Available Seats}
    I -->|Greater than 10| J[Show Green - AVAILABLE]
    I -->|1 to 9| K[Show Yellow - LIMITED]
    I -->|0| L[Show Red - SOLD OUT]
```

## 3. Booking Cancellation Flow

```mermaid
graph TB
    A[User Opens Dashboard] --> B[View Active Bookings]
    B --> C[User Clicks Cancel]
    C --> D[Confirmation Dialog]
    D --> E{Confirm?}
    E -->|No| F[Close Dialog]
    E -->|Yes| G[API: DELETE /tickets/id/cancel]
    G --> H[Verify Ticket Exists]
    H --> I{Exists?}
    I -->|No| J[Return 404 Error]
    I -->|Yes| K[Verify Ownership]
    K --> L{User Owns Ticket?}
    L -->|No| M[Return 400 Error]
    L -->|Yes| N[Check Event Date]
    N --> O{Future Event?}
    O -->|No| P[Return Error]
    O -->|Yes| Q[Update Status to CANCELLED]
    Q --> R[Save to Database]
    R --> S[Return Success]
    S --> T[Refresh Bookings List]
```

## 4. User Dashboard Load Flow

```mermaid
graph TB
    A[User Opens Dashboard] --> B{User ID in LocalStorage?}
    B -->|No| C[Show User ID Input Form]
    B -->|Yes| D[Load User ID]
    C --> E[User Enters ID]
    E --> F[Save to LocalStorage]
    F --> D
    D --> G[API: GET /tickets/user/id/bookings]
    G --> H[Fetch Active Tickets for User]
    H --> I[Join with Event Data]
    I --> J[Calculate Current Availability]
    J --> K[Build Booking Responses]
    K --> L[Return Array of Bookings]
    L --> M{Bookings Found?}
    M -->|No| N[Show Empty State]
    M -->|Yes| O[Display Booking Cards]
```

## 5. Database Transaction Flow (Booking)

```mermaid
graph TB
    A[START TRANSACTION] --> B[Lock Event Record]
    B --> C[Fetch Event Details]
    C --> D[Count Active Tickets]
    D --> E[Calculate Available]
    E --> F{Seats Available?}
    F -->|No| G[ROLLBACK]
    F -->|Yes| H[Create Ticket Record]
    H --> I[Set Status = ACTIVE]
    I --> J[Set Timestamp]
    J --> K[Generate Ticket Code]
    K --> L[Insert into Database]
    L --> M{Success?}
    M -->|No| N[ROLLBACK]
    M -->|Yes| O[COMMIT]
    O --> P[Release Lock]
    G --> Q[Return Error]
    N --> Q
    P --> R[Return Success]
```

## 6. API Error Handling Flow

```mermaid
graph TB
    A[API Request Received] --> B[Try Block]
    B --> C[Execute Business Logic]
    C --> D{Exception Thrown?}
    D -->|ResourceNotFoundException| E[Return 404 NOT FOUND]
    D -->|InsufficientSeatsException| F[Return 409 CONFLICT]
    D -->|InvalidBookingException| G[Return 400 BAD REQUEST]
    D -->|Other Exception| H[Return 500 INTERNAL ERROR]
    D -->|No Exception| I[Return Success Response]
    E --> J[Error JSON with message]
    F --> J
    G --> J
    H --> J
    I --> K[Success JSON with data]
```

## 7. Component State Management (TicketBooking)

```mermaid
graph TB
    A[Component Mounts] --> B[Initialize State]
    B --> C[Load Events from API]
    C --> D[Load User ID from LocalStorage]
    D --> E[User Selects Event]
    E --> F[Set selectedEventId]
    F --> G[Trigger checkAvailability]
    G --> H[Set checkingAvailability = true]
    H --> I[API Call]
    I --> J[Set availability data]
    J --> K[Set checkingAvailability = false]
    K --> L[User Submits Form]
    L --> M[Set loading = true]
    M --> N[API Call bookTicket]
    N --> O{Success?}
    O -->|Yes| P[Set success message]
    O -->|No| Q[Set error message]
    P --> R[Reset form]
    Q --> S[Set loading = false]
    R --> S
```

## 8. Real-time Availability Update Flow

```mermaid
graph TB
    A[Event Selection Changes] --> B[Clear Previous Availability]
    B --> C{Event Selected?}
    C -->|No| D[Show Select Event Message]
    C -->|Yes| E[Show Loading Indicator]
    E --> F[API: Check Availability]
    F --> G[Receive Availability Data]
    G --> H[Update State]
    H --> I[Calculate Color Code]
    I --> J{Available Seats}
    J -->|0| K[Red Badge + Disable Button]
    J -->|Less than 10| L[Yellow Badge + Enable Button]
    J -->|10 or more| M[Green Badge + Enable Button]
    K --> N[Render UI]
    L --> N
    M --> N
```

## 9. Backend Service Layer Flow

```mermaid
graph TB
    A[Controller Receives Request] --> B[Call Service Method]
    B --> C{Method Type}
    C -->|bookTicket| D[Validate Request]
    C -->|checkAvailability| E[Fetch Event]
    C -->|getUserBookings| F[Fetch User Tickets]
    C -->|cancelBooking| G[Verify Ticket]
    D --> H[Fetch User and Event]
    H --> I[Validate Event Date]
    I --> J[Check Available Seats]
    J --> K[Create Ticket]
    E --> L[Count Active Bookings]
    F --> M[Filter Active Status]
    G --> N[Verify Ownership]
    K --> O[Build Response]
    L --> O
    M --> O
    N --> P[Update Status]
    P --> O
    O --> Q[Return to Controller]
```

## 10. Security Validation Flow (Future Enhancement)

```mermaid
graph TB
    A[Request Arrives] --> B[Extract JWT Token]
    B --> C{Token Valid?}
    C -->|No| D[Return 401 Unauthorized]
    C -->|Yes| E[Extract User ID from Token]
    E --> F[Validate User Exists]
    F --> G{User Exists?}
    G -->|No| H[Return 403 Forbidden]
    G -->|Yes| I[Check User Permissions]
    I --> J{Has Permission?}
    J -->|No| K[Return 403 Forbidden]
    J -->|Yes| L[Execute Business Logic]
    L --> M[Return Response]
```

## Key Components Interaction

```
Frontend (React)                Backend (Spring Boot)              Database
┌──────────────────┐           ┌─────────────────────┐          ┌──────────┐
│  TicketBooking   │──────────>│  TicketController   │          │  tickets │
│   Component      │   HTTP    │                     │          │          │
└──────────────────┘           └──────────┬──────────┘          └────┬─────┘
                                          │                          │
┌──────────────────┐                      │                          │
│  UserDashboard   │                      │                          │
│   Component      │──────────>┌──────────▼──────────┐          ┌────▼─────┐
└──────────────────┘   HTTP    │   TicketService     │◄────────>│  events  │
                                │                     │   JPA    │          │
┌──────────────────┐            └──────────┬──────────┘          └────┬─────┘
│  ticketService   │                       │                          │
│      .js         │            ┌──────────▼──────────┐          ┌────▼─────┐
└──────────────────┘            │  TicketRepository   │◄────────>│  users   │
                                │                     │   SQL    │          │
                                └─────────────────────┘          └──────────┘
```

## State Transitions

### Ticket Status State Machine

```
    [Create Booking]
           │
           ▼
       ┌─────────┐
       │ ACTIVE  │
       └────┬────┘
            │
   [Cancel Booking]
            │
            ▼
      ┌───────────┐
      │ CANCELLED │
      └───────────┘
```

### Booking Lifecycle

```
1. User browses events
2. Checks availability (real-time)
3. Submits booking request
4. System validates and creates ticket
5. User receives ticket code
6. Ticket appears in dashboard
7. User can cancel if needed
8. Cancelled tickets free up seats
```

---

These diagrams illustrate the complete flow of the ticket booking system, showing how data moves between components and how different features interact with each other.
