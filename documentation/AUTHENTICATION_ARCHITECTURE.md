# Authentication & Authorization Architecture

## System Architecture Overview

```mermaid
graph TB
    Client[Frontend Client]
    
    subgraph "Spring Boot Application"
        Controller[Controllers]
        Security[Spring Security Layer]
        Service[Service Layer]
        Repository[Repository Layer]
        Database[(PostgreSQL Database)]
        
        subgraph "Security Components"
            SecurityConfig[SecurityConfig]
            UserDetailsService[CustomUserDetailsService]
            AuthManager[AuthenticationManager]
            PasswordEncoder[BCryptPasswordEncoder]
        end
        
        subgraph "Controllers"
            AuthController[AuthController]
            UserController[UserController]
            EventController[EventController]
            TicketController[TicketController]
        end
        
        subgraph "Services"
            UserService[UserService]
            EventService[EventService]
            TicketService[TicketService]
        end
    end
    
    Client --> Controller
    Controller --> Security
    Security --> Service
    Service --> Repository
    Repository --> Database
```

## Authentication Flow

```mermaid
graph LR
    A[User Login Request] --> B[AuthController]
    B --> C[AuthenticationManager]
    C --> D[DaoAuthenticationProvider]
    D --> E[CustomUserDetailsService]
    E --> F[UserRepository]
    F --> G[Database]
    G --> F
    F --> E
    E --> D
    D --> H[PasswordEncoder]
    H --> D
    D --> I{Valid?}
    I -->|Yes| J[Create SecurityContext]
    I -->|No| K[401 Unauthorized]
    J --> L[Create Session]
    L --> M[Set Session Cookie]
    M --> N[200 OK + User Data]
```

## Authorization Flow

```mermaid
graph LR
    A[HTTP Request + Session Cookie] --> B[SecurityFilterChain]
    B --> C{Session Valid?}
    C -->|No| D[401 Unauthorized]
    C -->|Yes| E[Load SecurityContext]
    E --> F{Endpoint Requires Auth?}
    F -->|No| G[Allow Access]
    F -->|Yes| H{Check @PreAuthorize}
    H --> I{Has Required Role?}
    I -->|Yes| J[Allow Access]
    I -->|No| K[403 Forbidden]
```

## Component Interaction Diagram

```mermaid
graph TB
    subgraph "Presentation Layer"
        AC[AuthController]
        UC[UserController]
        EC[EventController]
        TC[TicketController]
    end
    
    subgraph "Security Layer"
        SC[SecurityConfig]
        CUDS[CustomUserDetailsService]
        GEH[GlobalExceptionHandler]
    end
    
    subgraph "Business Logic Layer"
        US[UserService]
        ES[EventService]
        TS[TicketService]
    end
    
    subgraph "Data Access Layer"
        UR[UserRepository]
        ER[EventRepository]
        TR[TicketRepository]
    end
    
    subgraph "Data Layer"
        DB[(PostgreSQL)]
    end
    
    AC --> US
    UC --> US
    EC --> ES
    TC --> TS
    
    US --> UR
    ES --> ER
    TS --> TR
    
    UR --> DB
    ER --> DB
    TR --> DB
    
    SC -.-> CUDS
    CUDS --> UR
    
    AC -.-> GEH
    UC -.-> GEH
    EC -.-> GEH
    TC -.-> GEH
```

## Security Filter Chain

```mermaid
graph TB
    A[HTTP Request] --> B[CORS Filter]
    B --> C[CSRF Filter]
    C --> D[Session Management Filter]
    D --> E[Authentication Filter]
    E --> F[Authorization Filter]
    F --> G{Authorized?}
    G -->|Yes| H[Controller]
    G -->|No| I[Exception Handler]
    H --> J[Response]
    I --> J
```

## Role-Based Access Control Matrix

| Endpoint | Public | USER | ADMIN |
|----------|--------|------|-------|
| POST /api/auth/signup | ✅ | ✅ | ✅ |
| POST /api/auth/login | ✅ | ✅ | ✅ |
| POST /api/auth/logout | ❌ | ✅ | ✅ |
| GET /api/auth/me | ❌ | ✅ | ✅ |
| GET /users/profile | ❌ | ✅ | ✅ |
| PUT /users/profile | ❌ | ✅ | ✅ |
| GET /users/{id} | ❌ | ❌ | ✅ |
| GET /events/all | ✅ | ✅ | ✅ |
| POST /events/create | ❌ | ❌ | ✅ |
| PUT /events/update/{id} | ❌ | ❌ | ✅ |
| DELETE /events/delete/{id} | ❌ | ❌ | ✅ |
| POST /tickets/book | ❌ | ✅ | ✅ |
| GET /tickets/user/{userId}/bookings | ❌ | ✅ | ✅ |
| GET /tickets/all | ❌ | ❌ | ✅ |

## Data Model

```mermaid
erDiagram
    USER ||--o{ EVENT : creates
    USER ||--o{ TICKET : books
    EVENT ||--o{ TICKET : has
    
    USER {
        Long id PK
        String username UK
        String name
        String email UK
        String password
        Role role
    }
    
    EVENT {
        Long id PK
        String title
        String description
        String location
        LocalDate eventDate
        Integer maxAttendees
        Long organizerId FK
    }
    
    TICKET {
        Long id PK
        Long userId FK
        Long eventId FK
        Integer numberOfSeats
        LocalDateTime bookingDate
    }
```

## Session Management Architecture

```mermaid
graph TB
    A[User Login] --> B{Authentication Success?}
    B -->|Yes| C[Create SecurityContext]
    B -->|No| D[Return 401]
    C --> E[Create HTTP Session]
    E --> F[Generate Session ID]
    F --> G[Store SecurityContext in Session]
    G --> H[Set Cookie: ONVENT_SESSION]
    H --> I[Return to Client]
    
    J[Subsequent Request] --> K[Extract Session Cookie]
    K --> L{Valid Session?}
    L -->|Yes| M[Load SecurityContext]
    L -->|No| N[Return 401]
    M --> O[Process Request]
    
    P[Logout Request] --> Q[Invalidate Session]
    Q --> R[Clear SecurityContext]
    R --> S[Delete Cookie]
    S --> T[Return 200]
```

## Password Security Flow

```mermaid
graph LR
    A[User Signup] --> B{Password Valid?}
    B -->|No| C[400 Bad Request]
    B -->|Yes| D[BCrypt Hash]
    D --> E[Salt Generation]
    E --> F[Hash Password]
    F --> G[Store in Database]
    
    H[User Login] --> I[Get Hashed Password]
    I --> J[BCrypt Compare]
    J --> K{Match?}
    K -->|Yes| L[Authentication Success]
    K -->|No| M[401 Unauthorized]
```

## Error Handling Architecture

```mermaid
graph TB
    A[Exception Thrown] --> B{Exception Type}
    
    B -->|MethodArgumentNotValidException| C[400 Bad Request]
    B -->|AuthenticationException| D[401 Unauthorized]
    B -->|BadCredentialsException| D
    B -->|AccessDeniedException| E[403 Forbidden]
    B -->|ResourceNotFoundException| F[404 Not Found]
    B -->|InsufficientSeatsException| G[409 Conflict]
    B -->|InvalidBookingException| C
    B -->|RuntimeException| C
    B -->|Exception| H[500 Internal Server Error]
    
    C --> I[GlobalExceptionHandler]
    D --> I
    E --> I
    F --> I
    G --> I
    H --> I
    
    I --> J[Format Error Response]
    J --> K[Return to Client]
```

## Configuration Layers

```mermaid
graph TB
    subgraph "Application Configuration"
        A[application.properties]
        A --> B[Session Timeout]
        A --> C[Cookie Settings]
        A --> D[Database Config]
    end
    
    subgraph "Security Configuration"
        E[SecurityConfig.java]
        E --> F[Password Encoder]
        E --> G[Authentication Provider]
        E --> H[CORS Settings]
        E --> I[CSRF Settings]
        E --> J[URL Security Rules]
        E --> K[Session Management]
    end
    
    subgraph "Runtime Security"
        L[Spring Security Filter Chain]
        L --> M[Authentication Filters]
        L --> N[Authorization Filters]
        L --> O[Session Filters]
    end
    
    E --> L
    A --> E
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Client Tier"
        A[Web Browser]
        B[Mobile App]
    end
    
    subgraph "Application Tier"
        C[Spring Boot Application]
        D[Tomcat Server]
        C --> D
    end
    
    subgraph "Data Tier"
        E[(PostgreSQL Database)]
    end
    
    subgraph "Session Storage"
        F[In-Memory Session Store]
        G[Redis for Production]
    end
    
    A --> C
    B --> C
    C --> E
    C --> F
    C -.-> G
```

## Security Layers

```mermaid
graph TB
    A[Application Security Layers]
    
    A --> B[Network Security]
    B --> C[HTTPS/TLS]
    B --> D[CORS Policy]
    
    A --> E[Authentication Layer]
    E --> F[Session-Based Auth]
    E --> G[BCrypt Password Hashing]
    
    A --> H[Authorization Layer]
    H --> I[Role-Based Access Control]
    H --> J[Method-Level Security]
    
    A --> K[Input Validation]
    K --> L[Jakarta Validation]
    K --> M[Custom Validators]
    
    A --> N[Attack Prevention]
    N --> O[CSRF Protection]
    N --> P[Session Fixation Protection]
    N --> Q[XSS Prevention]
```

## Key Components Description

### 1. SecurityConfig
- Central security configuration
- Defines authentication and authorization rules
- Configures password encoding
- Sets up session management
- Manages CORS and CSRF

### 2. CustomUserDetailsService
- Bridges application User entity with Spring Security
- Loads user details from database
- Converts to Spring Security UserDetails
- Provides authorities based on user roles

### 3. AuthController
- Handles user registration
- Manages login/logout operations
- Provides current user endpoint
- Creates and manages sessions

### 4. UserService
- Business logic for user operations
- Password validation and encoding
- User profile management
- User lookup operations

### 5. GlobalExceptionHandler
- Centralized exception handling
- Consistent error responses
- Proper HTTP status codes
- Security-aware error messages

## Security Principles Applied

1. **Defense in Depth**: Multiple security layers
2. **Least Privilege**: Users have minimum required permissions
3. **Secure by Default**: Default role is USER, not ADMIN
4. **Fail Securely**: Errors don't expose sensitive information
5. **Complete Mediation**: Every request is checked
6. **Session Management**: Proper session lifecycle
7. **Password Security**: Strong hashing with BCrypt
8. **Input Validation**: All inputs validated
9. **CSRF Protection**: State-changing operations protected
10. **CORS Control**: Limited to trusted origins

## Performance Considerations

### Session Management
- In-memory storage for development
- Redis recommended for production
- Session timeout: 30 minutes
- Concurrent session limit: 1 per user

### Password Hashing
- BCrypt work factor: 10
- Balance between security and performance
- Consider caching user details

### Database Queries
- Indexed username and email fields
- Optimized user lookups
- Lazy loading for relationships

## Scalability Considerations

### Horizontal Scaling
- Use external session store (Redis)
- Stateless authentication alternative: JWT
- Load balancer with sticky sessions

### Session Clustering
- Share sessions across instances
- Use Spring Session with Redis
- Configure session replication

---

**This architecture provides a secure, scalable, and maintainable authentication and authorization system for the Onvent application.**
