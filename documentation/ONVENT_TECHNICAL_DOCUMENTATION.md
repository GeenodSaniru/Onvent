# ONVENT - Technical Documentation

## Table of Contents
1. [Project Setup & Configuration](#1-project-setup--configuration)
2. [Authentication & Authorization](#2-authentication--authorization)
3. [Entity & Database Layer](#3-entity--database-layer)
4. [Event Management (CRUD)](#4-event-management-crud)
5. [Ticket Booking & Dashboard](#5-ticket-booking--dashboard)
6. [Frontend UI/UX](#6-frontend-uiux)

---

## 1. Project Setup & Configuration

### Environment Setup
- **Backend**: Spring Boot 3.5.6 with Java 21
- **Frontend**: React with Vite build tool
- **Database**: PostgreSQL with Flyway for migrations
- **Build Tools**: Maven (backend), npm (frontend)

### Dependencies

#### Backend (pom.xml)
```xml
<dependencies>
    <!-- Spring Boot Starters -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- Database -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>
    
    <!-- Utilities -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    
    <!-- Email & PDF -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-mail</artifactId>
    </dependency>
    <dependency>
        <groupId>com.itextpdf</groupId>
        <artifactId>itext-core</artifactId>
        <version>9.0.0</version>
        <type>pom</type>
    </dependency>
    <dependency>
        <groupId>com.google.zxing</groupId>
        <artifactId>core</artifactId>
        <version>3.5.3</version>
    </dependency>
    
    <!-- Database Migration -->
    <dependency>
        <groupId>org.flywaydb</groupId>
        <artifactId>flyway-core</artifactId>
    </dependency>
    <dependency>
        <groupId>org.flywaydb</groupId>
        <artifactId>flyway-database-postgresql</artifactId>
    </dependency>
</dependencies>
```

#### Frontend (package.json)
```json
{
  "dependencies": {
    "axios": "^1.13.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.48.2",
    "react-icons": "^4.12.0",
    "react-router-dom": "^6.21.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "tailwindcss": "^3.3.5",
    "vite": "^5.0.0"
  }
}
```

### Build Tools Configuration

#### Maven (pom.xml)
```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <configuration>
                <annotationProcessorPaths>
                    <path>
                        <groupId>org.projectlombok</groupId>
                        <artifactId>lombok</artifactId>
                    </path>
                </annotationProcessorPaths>
            </configuration>
        </plugin>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <mainClass>ac.nsbm.onvent.OnventNewApplication</mainClass>
                <excludes>
                    <exclude>
                        <groupId>org.projectlombok</groupId>
                        <artifactId>lombok</artifactId>
                    </exclude>
                </excludes>
            </configuration>
        </plugin>
    </plugins>
</build>
```

### Port Configurations

#### Backend (application.properties)
```properties
spring.application.name=Onvent
server.port=8088
```

#### Frontend (vite.config.js)
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
```

### Application Properties

#### Database Configuration
```properties
spring.datasource.url=jdbc:postgresql://ep-spring-lake-a1bcriug-pooler.ap-southeast-1.aws.neon.tech:5432/neondb?sslmode=require&channel_binding=require
spring.datasource.username=neondb_owner
spring.datasource.password=npg_4aenVMPAmJw9
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
```

#### Connection Pool (HikariCP)
```properties
spring.datasource.hikari.connection-timeout=20000
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.idle-timeout=300000
spring.datasource.hikari.max-lifetime=600000
spring.datasource.hikari.auto-commit=true
```

#### Flyway Migration
```properties
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
spring.flyway.baseline-on-migrate=true
```

#### Session Configuration
```properties
server.servlet.session.timeout=30m
server.servlet.session.cookie.http-only=true
server.servlet.session.cookie.secure=false
server.servlet.session.cookie.max-age=1800
```

#### Email Configuration
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

---

## 2. Authentication & Authorization

### Security Configuration

#### SecurityConfig.java
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider(UserDetailsService userDetailsService) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, SecurityContextRepository securityContextRepository) throws Exception {
        CsrfTokenRequestAttributeHandler requestHandler = new CsrfTokenRequestAttributeHandler();
        requestHandler.setCsrfRequestAttributeName("_csrf");

        http
            .securityContext(securityContext -> securityContext
                .securityContextRepository(securityContextRepository))
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .csrfTokenRequestHandler(requestHandler)
                .ignoringRequestMatchers(
                    "/api/v1/auth/login",
                    "/api/v1/auth/signup",
                    "/api/v1/auth/logout",
                    "/api/v1/events/**",
                    "/api/v1/tickets/**",
                    "/api/v1/test/**"
                )
            )
            .authorizeHttpRequests(authz -> authz
                // Public endpoints
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/api/v1/test/**").permitAll()
                
                // Event endpoints - Browse available for all, management for authenticated users
                .requestMatchers(HttpMethod.GET, "/api/v1/events/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/events/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/v1/events/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/events/**").hasAnyRole("USER", "ADMIN")
                
                // Ticket endpoints - Users can book, ADMIN can view all
                .requestMatchers(HttpMethod.POST, "/api/v1/tickets/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/v1/tickets/user/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/tickets/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/v1/tickets/admin/**").hasRole("ADMIN")
                
                // All other requests require authentication
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            )
            .httpBasic(httpBasic -> httpBasic.disable());
            
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5177", "https://onvent.netlify.app"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

### User Roles

#### Role.java
```java
public enum Role {
    USER, ADMIN
}
```

### Session Management
- Cookie-based session authentication
- Session timeout: 30 minutes of inactivity
- HTTP-only cookies to prevent XSS attacks
- Maximum 1 concurrent session per user
- Proper session invalidation on logout

### CSRF Protection
- CSRF tokens enabled for all state-changing operations
- Cookie-based CSRF token repository
- Excluded endpoints: /api/v1/auth/login, /api/v1/auth/signup, /api/v1/auth/logout, /api/v1/events/**, /api/v1/tickets/**, /api/v1/test/**

### Login/Logout Flows

#### AuthController.java (Login)
```java
@PostMapping("/login")
public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest, HttpServletRequest request, HttpServletResponse response) {
    try {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail(),
                        loginRequest.getPassword()
                )
        );
        
        // Set authentication in SecurityContext
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(authentication);
        SecurityContextHolder.setContext(securityContext);
        
        // Save the security context to the repository
        securityContextRepository.saveContext(securityContext, request, response);
        
        // Get user details
        User user = userService.findByUsernameOrEmail(loginRequest.getUsernameOrEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        AuthResponse resp = userService.convertToAuthResponse(user, "Login successful");
        return ResponseEntity.ok(resp);
    } catch (BadCredentialsException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(createErrorResponse("Invalid username/email or password"));
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("An error occurred during login"));
    }
}
```

#### AuthController.java (Logout)
```java
@PostMapping("/logout")
public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
    try {
        // Clear security context
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContextRepository.saveContext(securityContext, request, response);
        
        Map<String, String> resp = new HashMap<>();
        resp.put("message", "Logout successful");
        return ResponseEntity.ok(resp);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("An error occurred during logout"));
    }
}
```

### Password Encryption
- BCrypt hashing with salt
- Minimum password requirements:
  - At least 8 characters long
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one digit

---

## 3. Entity & Database Layer

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL CHECK (role IN ('USER', 'ADMIN'))
);
```

#### Events Table
```sql
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    location VARCHAR(255) NOT NULL,
    date TIMESTAMP(6) NOT NULL,
    category VARCHAR(255),
    price DOUBLE PRECISION NOT NULL,
    seats INTEGER,
    image VARCHAR(255),
    organizer_id BIGINT NOT NULL,
    CONSTRAINT fk_events_organizer FOREIGN KEY (organizer_id) REFERENCES users(id)
);
```

#### Tickets Table
```sql
CREATE TABLE tickets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    ticket_type_id BIGINT,
    ticket_code VARCHAR(255) NOT NULL UNIQUE,
    purchase_date TIMESTAMP(6) NOT NULL,
    status VARCHAR(255) NOT NULL CHECK (status IN ('ACTIVE', 'CANCELLED')),
    CONSTRAINT fk_tickets_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_tickets_event FOREIGN KEY (event_id) REFERENCES events(id),
    CONSTRAINT fk_tickets_ticket_type FOREIGN KEY (ticket_type_id) REFERENCES ticket_types(id)
);
```

#### Ticket Types Table
```sql
CREATE TABLE ticket_types (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    quantity INTEGER NOT NULL,
    event_id BIGINT NOT NULL,
    CONSTRAINT fk_ticket_types_event FOREIGN KEY (event_id) REFERENCES events(id)
);
```

### Entity Classes

#### User.java
```java
@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String username;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String password;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
    
    @OneToMany(mappedBy = "organizer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Event> organizedEvents;
}
```

#### Event.java
```java
@Entity
@Table(name = "events")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "description", length = 1000)
    private String description;
    
    @Column(name = "location", nullable = false)
    private String location;
    
    @Column(name = "date", nullable = false)
    private LocalDateTime date;
    
    @Column(name = "category")
    private String category;
    
    @Column(name = "price", nullable = false)
    private Double price;
    
    @Column(name = "seats")
    private Integer seats;
    
    @Column(name = "image")
    private String image;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", nullable = false)
    private User organizer;
}
```

#### Ticket.java
```java
@Entity
@Table(name = "tickets")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_type_id")
    private TicketType ticketType;
    
    @Column(name = "ticket_code", nullable = false)
    private String ticketCode;
    
    @Column(name = "purchase_date", nullable = false)
    private LocalDateTime purchaseDate;
    
    @Column(nullable = false)
    private String status;
    
    // Enum for ticket status
    public enum TicketStatus {
        ACTIVE, CANCELLED
    }
}
```

#### TicketType.java
```java
@Entity
@Table(name = "ticket_types")
public class TicketType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private Double price;
    
    @Column(name = "quantity", nullable = false)
    private Integer quantity;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;
    
    @OneToMany(mappedBy = "ticketType", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Ticket> tickets = new ArrayList<>();
}
```

### Repositories

#### UserRepository.java
```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByUsernameOrEmail(String username, String email);
    Optional<User> findByUsernameOrEmail(String usernameOrEmail);
}
```

#### EventRepository.java
```java
@Repository
public interface EventRepository extends JpaRepository<Event, Long>, CustomEventRepository {
    Page<Event> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    Page<Event> findByCategoryContainingIgnoreCase(String category, Pageable pageable);
    Page<Event> findByDateAfter(LocalDateTime date, Pageable pageable);
    
    List<Event> findBySeatsGreaterThan(Integer seats);
}
```

#### TicketRepository.java
```java
@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByUser(User user);
    Page<Ticket> findByUser(User user, Pageable pageable);
    List<Ticket> findByEvent(Event event);
    Page<Ticket> findByEvent(Event event, Pageable pageable);
    
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.event.id = :eventId AND t.status = 'ACTIVE'")
    Long countActiveTicketsByEventId(@Param("eventId") Long eventId);
    
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.ticketType.id = :ticketTypeId AND t.status = 'ACTIVE'")
    Long countActiveTicketsByTicketTypeId(@Param("ticketTypeId") Long ticketTypeId);
    
    @Query("SELECT t FROM Ticket t WHERE t.user.id = :userId AND t.status = 'ACTIVE'")
    List<Ticket> findActiveTicketsByUserId(@Param("userId") Long userId);
}
```

#### TicketTypeRepository.java
```java
@Repository
public interface TicketTypeRepository extends JpaRepository<TicketType, Long> {
    List<TicketType> findByEvent(Event event);
}
```

### Flyway Migrations

#### V1__Initial_Schema.sql
```sql
-- Create users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL CHECK (role IN ('USER', 'ADMIN'))
);

-- Create events table
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    location VARCHAR(255) NOT NULL,
    event_date TIMESTAMP(6) NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    max_attendees INTEGER NOT NULL,
    organizer_id BIGINT NOT NULL,
    CONSTRAINT fk_events_organizer FOREIGN KEY (organizer_id) REFERENCES users(id)
);

-- Create tickets table
CREATE TABLE tickets (
    id BIGSERIAL PRIMARY KEY,
    purchase_date TIMESTAMP(6) NOT NULL,
    ticket_code VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(255) NOT NULL CHECK (status IN ('ACTIVE', 'CANCELLED')),
    event_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    CONSTRAINT fk_tickets_event FOREIGN KEY (event_id) REFERENCES events(id),
    CONSTRAINT fk_tickets_user FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### V4__Clean_Up_Event_Schema.sql
```sql
-- Clean up events table schema to match the current entity structure
-- This migration ensures that we have a consistent schema that works with our current code

-- First, check if we have both old and new columns, and consolidate data
DO $$
BEGIN
    -- Handle date fields consolidation
    -- If we have both event_date and date columns, ensure data is synced
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'event_date') 
       AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'date') THEN
        -- Update any rows where date is null but event_date has data
        UPDATE events SET date = event_date WHERE date IS NULL AND event_date IS NOT NULL;
        -- Update any rows where event_date is null but date has data
        UPDATE events SET event_date = date WHERE event_date IS NULL AND date IS NOT NULL;
    END IF;
    
    -- Handle seats fields consolidation
    -- If we have both max_attendees and seats columns, ensure data is synced
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'max_attendees') 
       AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'seats') THEN
        -- Update any rows where seats is null but max_attendees has data
        UPDATE events SET seats = max_attendees WHERE seats IS NULL AND max_attendees IS NOT NULL;
        -- Update any rows where max_attendees is null but seats has data
        UPDATE events SET max_attendees = seats WHERE max_attendees IS NULL AND seats IS NOT NULL;
    END IF;
END $$;

-- Now drop the old columns if they exist and we have the new ones
-- But only drop if we have the new columns to avoid data loss
DO $$
BEGIN
    -- Only drop event_date if we have the date column
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'date') THEN
        ALTER TABLE events DROP COLUMN IF EXISTS event_date;
    END IF;
    
    -- Only drop max_attendees if we have the seats column
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'seats') THEN
        ALTER TABLE events DROP COLUMN IF EXISTS max_attendees;
    END IF;
END $$;

-- Ensure we have all the required columns with correct names
ALTER TABLE events ADD COLUMN IF NOT EXISTS date TIMESTAMP(6);
ALTER TABLE events ADD COLUMN IF NOT EXISTS seats INTEGER;
ALTER TABLE events ADD COLUMN IF NOT EXISTS category VARCHAR(255);
ALTER TABLE events ADD COLUMN IF NOT EXISTS image VARCHAR(255);

-- Set NOT NULL constraints where needed (but only if column exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'date') THEN
        ALTER TABLE events ALTER COLUMN date SET NOT NULL;
    END IF;
END $$;
```

---

## 4. Event Management (CRUD)

### Event Creation

#### EventController.java (Create)
```java
@PostMapping
public ResponseEntity<?> createEvent(@RequestBody EventDTO eventDTO) {
    try {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || 
            authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("You must be logged in to create an event"));
        }
        
        String username = authentication.getName();
        EventDTO createdEvent = eventService.createEvent(eventDTO, username);
        return new ResponseEntity<>(createdEvent, HttpStatus.CREATED);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Failed to create event: " + e.getMessage()));
    }
}
```

#### EventService.java (Create)
```java
@Transactional
public EventDTO createEvent(EventDTO eventDTO, String organizerUsername) {
    // Fetch the organizer user
    User organizer = userRepository.findByUsername(organizerUsername)
            .orElseThrow(() -> new RuntimeException("Organizer not found"));

    // Create event with organizer
    Event event = new Event();
    event.setTitle(eventDTO.getTitle());
    event.setDescription(eventDTO.getDescription());
    event.setLocation(eventDTO.getVenue());
    event.setDate(eventDTO.getDate());
    event.setCategory(eventDTO.getCategory());
    event.setPrice(eventDTO.getPrice());
    event.setSeats(eventDTO.getSeats());
    event.setImage(eventDTO.getImageUrl());
    event.setOrganizer(organizer);

    Event savedEvent = eventRepository.save(event);
    return convertToDTO(savedEvent);
}
```

### Event Retrieval

#### EventController.java (Get All)
```java
@GetMapping
public ResponseEntity<List<EventDTO>> getAllEvents() {
    try {
        List<EventDTO> events = eventService.getAllEvents();
        return new ResponseEntity<>(events, HttpStatus.OK);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(null);
    }
}
```

#### EventController.java (Search)
```java
@GetMapping("/search")
public ResponseEntity<Page<EventDTO>> searchEvents(
        @RequestParam(required = false) String title,
        @RequestParam(required = false) String category,
        @RequestParam(required = false) String date,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "date") String sortBy,
        @RequestParam(defaultValue = "asc") String sortDir) {
    
    try {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        LocalDateTime dateTime = null;
        if (date != null && !date.isEmpty()) {
            dateTime = LocalDateTime.parse(date);
        }
        
        Page<EventDTO> events = eventService.searchEvents(title, category, dateTime, pageable);
        return new ResponseEntity<>(events, HttpStatus.OK);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(null);
    }
}
```

#### EventService.java (Search)
```java
public Page<EventDTO> searchEvents(String title, String category, LocalDateTime date, Pageable pageable) {
    Page<Event> events = eventRepository.findEventsWithFilters(title, category, date, pageable);
    return events.map(this::convertToDTO);
}
```

#### CustomEventRepositoryImpl.java (Custom Search)
```java
@Override
public Page<Event> findEventsWithFilters(String title, String category, LocalDateTime date, Pageable pageable) {
    StringBuilder countQueryStr = new StringBuilder("SELECT COUNT(e) FROM Event e WHERE 1=1");
    StringBuilder dataQueryStr = new StringBuilder("SELECT e FROM Event e WHERE 1=1");
    
    if (title != null && !title.isEmpty()) {
        countQueryStr.append(" AND LOWER(e.title) LIKE LOWER(CONCAT('%', :title, '%'))");
        dataQueryStr.append(" AND LOWER(e.title) LIKE LOWER(CONCAT('%', :title, '%'))");
    }
    
    if (category != null && !category.isEmpty()) {
        countQueryStr.append(" AND LOWER(e.category) LIKE LOWER(CONCAT('%', :category, '%'))");
        dataQueryStr.append(" AND LOWER(e.category) LIKE LOWER(CONCAT('%', :category, '%'))");
    }
    
    if (date != null) {
        countQueryStr.append(" AND e.date >= :date");
        dataQueryStr.append(" AND e.date >= :date");
    }
    
    dataQueryStr.append(" ORDER BY e.date");
    
    // Count query
    Query countQuery = entityManager.createQuery(countQueryStr.toString());
    if (title != null && !title.isEmpty()) {
        countQuery.setParameter("title", title);
    }
    if (category != null && !category.isEmpty()) {
        countQuery.setParameter("category", category);
    }
    if (date != null) {
        countQuery.setParameter("date", date);
    }
    long total = (Long) countQuery.getSingleResult();
    
    // Data query
    Query dataQuery = entityManager.createQuery(dataQueryStr.toString(), Event.class)
            .setFirstResult((int) pageable.getOffset())
            .setMaxResults(pageable.getPageSize());
    
    if (title != null && !title.isEmpty()) {
        dataQuery.setParameter("title", title);
    }
    if (category != null && !category.isEmpty()) {
        dataQuery.setParameter("category", category);
    }
    if (date != null) {
        dataQuery.setParameter("date", date);
    }
    
    List<Event> events = dataQuery.getResultList();
    
    return new PageImpl<>(events, pageable, total);
}
```

### Event Update

#### EventController.java (Update)
```java
@PutMapping("/{id}")
public ResponseEntity<?> updateEvent(@PathVariable Long id, @RequestBody EventDTO eventDTO) {
    try {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || 
            authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("You must be logged in to update an event"));
        }
        
        String username = authentication.getName();
        EventDTO updatedEvent = eventService.updateEvent(id, eventDTO, username);
        return new ResponseEntity<>(updatedEvent, HttpStatus.OK);
    } catch (RuntimeException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(createErrorResponse(e.getMessage()));
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Failed to update event: " + e.getMessage()));
    }
}
```

#### EventService.java (Update)
```java
@Transactional
public EventDTO updateEvent(Long id, EventDTO eventDTO, String organizerUsername) {
    Event existingEvent = eventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));

    // Check if the current user is the organizer of the event
    if (!existingEvent.getOrganizer().getUsername().equals(organizerUsername)) {
        throw new RuntimeException("You are not authorized to update this event");
    }

    // Update event details
    existingEvent.setTitle(eventDTO.getTitle());
    existingEvent.setDescription(eventDTO.getDescription());
    existingEvent.setLocation(eventDTO.getVenue());
    existingEvent.setDate(eventDTO.getDate());
    existingEvent.setCategory(eventDTO.getCategory());
    existingEvent.setPrice(eventDTO.getPrice());
    existingEvent.setSeats(eventDTO.getSeats());
    existingEvent.setImage(eventDTO.getImageUrl());

    Event updatedEvent = eventRepository.save(existingEvent);
    return convertToDTO(updatedEvent);
}
```

### Event Deletion

#### EventController.java (Delete)
```java
@DeleteMapping("/{id}")
public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
    try {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || 
            authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("You must be logged in to delete an event"));
        }
        
        String username = authentication.getName();
        eventService.deleteEvent(id, username);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    } catch (RuntimeException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(createErrorResponse(e.getMessage()));
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Failed to delete event: " + e.getMessage()));
    }
}
```

#### EventService.java (Delete)
```java
@Transactional
public void deleteEvent(Long id, String organizerUsername) {
    Event existingEvent = eventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));

    // Check if the current user is the organizer of the event
    if (!existingEvent.getOrganizer().getUsername().equals(organizerUsername)) {
        throw new RuntimeException("You are not authorized to delete this event");
    }

    eventRepository.deleteById(id);
}
```

### DTOs

#### EventDTO.java
```java
@Data
public class EventDTO {
    private Long id;
    private String title;
    private String description;
    private String venue;
    private LocalDateTime date;
    private String category;
    private Double price;
    private Integer seats;
    private String imageUrl;
    private Long organizerId;
    private String organizerName;
}
```

---

## 5. Ticket Booking & Dashboard

### Ticket Booking Flow

#### BookingRequest.java
```java
@Data
public class BookingRequest {
    @NotNull(message = "User ID is required")
    private Long userId;
    
    @NotNull(message = "Event ID is required")
    private Long eventId;
    
    private Long ticketTypeId;
    
    @Min(value = 1, message = "Number of tickets must be at least 1")
    private Integer numberOfTickets;
}
```

#### BookingResponse.java
```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private Long ticketId;
    private String ticketCode;
    private Long userId;
    private String userName;
    private Long eventId;
    private String eventTitle;
    private String eventLocation;
    private LocalDateTime eventDate;
    private Double eventPrice;
    private LocalDateTime purchaseDate;
    private String status;
    private Integer availableSeats;
}
```

#### TicketController.java (Book Ticket)
```java
@PostMapping("/book")
public ResponseEntity<?> bookTicket(@RequestBody BookingRequest bookingRequest) {
    try {
        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || 
            authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("You must be logged in to book tickets"));
        }
        
        String username = authentication.getName();
        User currentUser = userService.findByUsernameOrEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Set the user ID in the booking request
        bookingRequest.setUserId(currentUser.getId());
        
        BookingResponse response = ticketService.bookTicket(bookingRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    } catch (RuntimeException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(createErrorResponse(e.getMessage()));
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Failed to book ticket: " + e.getMessage()));
    }
}
```

#### TicketService.java (Book Ticket)
```java
@Transactional
public BookingResponse bookTicket(BookingRequest request) {
    // Validate request
    if (request.getUserId() == null || request.getEventId() == null) {
        throw new InvalidBookingException("User ID and Event ID are required");
    }
    
    // Default to 1 ticket if not specified
    int numberOfTickets = request.getNumberOfTickets() != null ? request.getNumberOfTickets() : 1;
    
    if (numberOfTickets <= 0) {
        throw new InvalidBookingException("Number of tickets must be greater than 0");
    }
    
    // Fetch user and event
    User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + request.getUserId()));
    
    Event event = eventRepository.findById(request.getEventId())
            .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + request.getEventId()));
    
    // Check if event has already occurred
    if (event.getDate().isBefore(LocalDateTime.now())) {
        throw new InvalidBookingException("Cannot book tickets for past events");
    }
    
    TicketType ticketType = null;
    Double ticketPrice = event.getPrice(); // Default to event price
    
    // If ticket type is specified, validate it
    if (request.getTicketTypeId() != null) {
        ticketType = ticketTypeRepository.findById(request.getTicketTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Ticket type not found with ID: " + request.getTicketTypeId()));
        
        // Verify ticket type belongs to this event
        if (!ticketType.getEvent().getId().equals(event.getId())) {
            throw new InvalidBookingException("Invalid ticket type for this event");
        }
        
        ticketPrice = ticketType.getPrice();
    }
    
    // Check available seats for this ticket type or overall event
    int availableSeats;
    if (ticketType != null) {
        // Check ticket type specific availability
        Long bookedSeats = ticketRepository.countActiveTicketsByTicketTypeId(ticketType.getId());
        availableSeats = ticketType.getQuantity() - bookedSeats.intValue();
    } else {
        // Check overall event availability
        Long bookedSeats = ticketRepository.countActiveTicketsByEventId(event.getId());
        availableSeats = event.getSeats() - bookedSeats.intValue();
    }
    
    if (availableSeats < numberOfTickets) {
        throw new InsufficientSeatsException("Insufficient seats available. Available: " + availableSeats + ", Requested: " + numberOfTickets);
    }
    
    // For simplicity, we'll book just one ticket (can be extended for multiple)
    // Generate unique ticket code
    String ticketCode = "TKT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    
    // Create ticket
    Ticket ticket = new Ticket();
    ticket.setUser(user);
    ticket.setEvent(event);
    ticket.setTicketType(ticketType);
    ticket.setTicketCode(ticketCode);
    ticket.setPurchaseDate(LocalDateTime.now());
    ticket.setStatus(Ticket.TicketStatus.ACTIVE.name());
    
    ticket = ticketRepository.save(ticket);
    
    // Build response
    BookingResponse response = new BookingResponse(
        ticket.getId(),
        ticket.getTicketCode(),
        ticket.getUser().getId(),
        ticket.getUser().getName(),
        ticket.getEvent().getId(),
        ticket.getEvent().getTitle(),
        ticket.getEvent().getLocation(),
        ticket.getEvent().getDate(),
        ticket.getEvent().getPrice(),
        ticket.getPurchaseDate(),
        ticket.getStatus(),
        availableSeats
    );
    
    // Send booking confirmation email
    try {
        emailService.sendBookingConfirmation(response, user.getEmail());
    } catch (Exception e) {
        // Log the error but don't fail the booking process
        System.err.println("Failed to send booking confirmation email: " + e.getMessage());
    }
    
    return response;
}
```

### Dashboard Statistics

#### DashboardStatsDTO.java
```java
@Data
public class DashboardStatsDTO {
    private Long totalEvents;
    private Long totalTickets;
    private Double totalRevenue;
    
    public DashboardStatsDTO() {
        this.totalEvents = 0L;
        this.totalTickets = 0L;
        this.totalRevenue = 0.0;
    }
    
    public DashboardStatsDTO(Long totalEvents, Long totalTickets, Double totalRevenue) {
        this.totalEvents = totalEvents;
        this.totalTickets = totalTickets;
        this.totalRevenue = totalRevenue;
    }
}
```

#### TicketController.java (Dashboard Stats)
```java
@GetMapping("/admin/stats")
public ResponseEntity<?> getDashboardStats() {
    try {
        // Check if user is admin
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || 
            authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("You must be logged in to view dashboard statistics"));
        }
        
        // In a real implementation, you would check if the user has admin role
        // For now, we'll just return the stats
        
        DashboardStatsDTO stats = ticketService.getDashboardStats();
        return ResponseEntity.ok(stats);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Failed to fetch dashboard statistics: " + e.getMessage()));
    }
}
```

#### TicketService.java (Dashboard Stats)
```java
public DashboardStatsDTO getDashboardStats() {
    // Get total events
    long totalEvents = eventRepository.count();
    
    // Get total tickets
    long totalTickets = ticketRepository.count();
    
    // Calculate total revenue
    List<Ticket> allTickets = ticketRepository.findAll();
    double totalRevenue = allTickets.stream()
            .mapToDouble(ticket -> {
                if (ticket.getTicketType() != null) {
                    return ticket.getTicketType().getPrice();
                } else if (ticket.getEvent() != null) {
                    return ticket.getEvent().getPrice();
                }
                return 0.0;
            })
            .sum();
    
    return new DashboardStatsDTO(totalEvents, totalTickets, totalRevenue);
}
```

### User Tickets Management

#### TicketController.java (Get User Tickets)
```java
@GetMapping("/user/list")
public ResponseEntity<?> getUserTicketsList() {
    try {
        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || 
            authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("You must be logged in to view your tickets"));
        }
        
        String username = authentication.getName();
        User currentUser = userService.findByUsernameOrEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<BookingResponse> tickets = ticketService.getUserBookingsList(currentUser.getId());
        return ResponseEntity.ok(tickets);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Failed to fetch user tickets: " + e.getMessage()));
    }
}
```

#### TicketService.java (Get User Tickets)
```java
public List<BookingResponse> getUserBookingsList(Long userId) {
    return getUserBookings(userId);
}

public List<BookingResponse> getUserBookings(Long userId) {
    List<Ticket> tickets = ticketRepository.findActiveTicketsByUserId(userId);
    
    return tickets.stream()
            .map(ticket -> {
                int availableSeats;
                if (ticket.getTicketType() != null) {
                    Long bookedSeats = ticketRepository.countActiveTicketsByTicketTypeId(ticket.getTicketType().getId());
                    availableSeats = ticket.getTicketType().getQuantity() - bookedSeats.intValue();
                } else {
                    Long bookedSeats = ticketRepository.countActiveTicketsByEventId(ticket.getEvent().getId());
                    availableSeats = ticket.getEvent().getSeats() - bookedSeats.intValue();
                }
                
                return new BookingResponse(
                    ticket.getId(),
                    ticket.getTicketCode(),
                    ticket.getUser().getId(),
                    ticket.getUser().getName(),
                    ticket.getEvent().getId(),
                    ticket.getEvent().getTitle(),
                    ticket.getEvent().getLocation(),
                    ticket.getEvent().getDate(),
                    ticket.getEvent().getPrice(),
                    ticket.getPurchaseDate(),
                    ticket.getStatus(),
                    availableSeats
                );
            })
            .collect(Collectors.toList());
}
```

#### TicketController.java (Cancel Ticket)
```java
@DeleteMapping("/{id}")
public ResponseEntity<?> cancelTicket(@PathVariable Long id) {
    try {
        ticketService.cancelBooking(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Ticket cancelled successfully");
        return ResponseEntity.ok(response);
    } catch (RuntimeException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(createErrorResponse(e.getMessage()));
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Failed to cancel ticket: " + e.getMessage()));
    }
}
```

#### TicketService.java (Cancel Ticket)
```java
@Transactional
public void cancelBooking(Long ticketId) {
    Ticket ticket = ticketRepository.findById(ticketId)
            .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with ID: " + ticketId));
    
    // Check if already cancelled
    if (ticket.getStatus().equals(Ticket.TicketStatus.CANCELLED.name())) {
        throw new InvalidBookingException("Ticket is already cancelled");
    }
    
    ticket.setStatus(Ticket.TicketStatus.CANCELLED.name());
    ticketRepository.save(ticket);
}
```

---

## 6. Frontend UI/UX

### Project Structure
```
frontend/onvent-new/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── pages/
│   │   ├── AdminDashboard.jsx
│   │   ├── BookingForm.jsx
│   │   ├── CreateEvent.jsx
│   │   ├── EditEvent.jsx
│   │   ├── EventDetails.jsx
│   │   ├── EventList.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── UserDashboard.jsx
│   ├── components/
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── eventService.js
│   │   └── ticketService.js
│   └── utils/
├── package.json
├── vite.config.js
└── tailwind.config.js
```

### React Components

#### App.jsx (Routing)
```jsx
function App() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/book/:eventId" element={<BookingForm />} />
          <Route path="/user/dashboard" element={
            <ProtectedRoute role="USER">
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/events/create" element={
            <ProtectedRoute role="ADMIN">
              <CreateEvent />
            </ProtectedRoute>
          } />
          <Route path="/admin/events/:id/edit" element={
            <ProtectedRoute role="ADMIN">
              <EditEvent />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
```

#### Login.jsx
```jsx
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import authService from '../services/authService'
import { FaUser, FaLock } from 'react-icons/fa'

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setLoading(true)
    setError('')
    
    try {
      const response = await authService.login(data)
      
      if (response) {
        // Redirect based on role
        if (response.role === 'ADMIN') {
          navigate('/admin/dashboard')
        } else {
          navigate('/user/dashboard')
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.error || 
                         err.response?.data?.message || 
                         err.message || 
                         'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary flex items-center justify-center">
            <FaUser className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your credentials to access your account
          </p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="usernameOrEmail" className="form-label">
              Email or Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                id="usernameOrEmail"
                type="text"
                {...register('usernameOrEmail', { 
                  required: 'Email or username is required' 
                })}
                className="form-input pl-10"
                placeholder="Enter your email or username"
              />
            </div>
            {errors.usernameOrEmail && (
              <p className="mt-1 text-sm text-red-600">
                {errors.usernameOrEmail.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  }
                })}
                className="form-input pl-10"
                placeholder="Enter your password"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex justify-center items-center"
            >
              {loading ? (
                <>
                  <div className="loading-spinner mr-2"></div>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Don't have an account?
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Link
              to="/register"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Register for an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
```

#### UserDashboard.jsx
```jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ticketService from '../services/ticketService'
import eventService from '../services/eventService'
import authService from '../services/authService'
import { FaTicketAlt, FaCalendarAlt, FaMapMarkerAlt, FaChair, FaTimes } from 'react-icons/fa'

const UserDashboard = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelingTicket, setCancelingTicket] = useState(null)
  const user = authService.getUser()

  useEffect(() => {
    loadUserTickets()
  }, [])

  const loadUserTickets = async () => {
    try {
      setLoading(true)
      const data = await ticketService.getUserTicketsList()
      // Sort tickets by booking date (newest first)
      const sortedTickets = data.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate))
      setTickets(sortedTickets)
    } catch (err) {
      setError('Failed to load your tickets')
      console.error('Error loading tickets:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelTicket = async (ticketId) {
    if (!window.confirm('Are you sure you want to cancel this ticket?')) {
      return
    }
    
    try {
      setCancelingTicket(ticketId)
      await ticketService.cancelTicket(ticketId)
      // Remove cancelled ticket from the list
      setTickets(tickets.filter(ticket => ticket.ticketId !== ticketId))
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel ticket')
    } finally {
      setCancelingTicket(null)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name || user?.username}!</p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">My Upcoming Events</h2>
          <p className="mt-1 text-sm text-gray-500">
            View and manage your booked tickets
          </p>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="loading-spinner"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-12">
              <FaTicketAlt className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets booked</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by booking your first event ticket.
              </p>
              <div className="mt-6">
                <Link
                  to="/events"
                  className="btn-primary"
                >
                  Browse Events
                </Link>
              </div>
            </div>
          ) : (
            <div className="ticket-list">
              {tickets.map((ticket) => (
                <div key={ticket.ticketId} className="ticket-item">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-lg font-bold text-gray-900">
                          {ticket.eventTitle || 'Event Title'}
                        </h3>
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {ticket.status}
                        </span>
                      </div>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <FaCalendarAlt className="mr-2" />
                          {ticket.eventDate ? formatDate(ticket.eventDate) : 'Event Date'}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <FaMapMarkerAlt className="mr-2" />
                          {ticket.eventLocation || 'Event Venue'}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <FaChair className="mr-2" />
                          1 ticket
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <FaTicketAlt className="mr-2" />
                          Total: ${ticket.eventPrice?.toFixed(2)}
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        Booked on: {formatDate(ticket.purchaseDate)}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        Ticket Code: {ticket.ticketCode}
                      </div>
                    </div>
                    <button
                      onClick={() => handleCancelTicket(ticket.ticketId)}
                      disabled={cancelingTicket === ticket.ticketId}
                      className="ml-4 inline-flex items-center p-2 border border-transparent rounded-full text-red-700 hover:bg-red-100 focus:outline-none"
                    >
                      {cancelingTicket === ticket.ticketId ? (
                        <div className="loading-spinner w-4 h-4"></div>
                      ) : (
                        <FaTimes className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
```

#### AdminDashboard.jsx
```jsx
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import eventService from '../services/eventService'
import ticketService from '../services/ticketService'
import { FaCalendarAlt, FaTicketAlt, FaUsers, FaPlus, FaEdit, FaTrash } from 'react-icons/fa'

const AdminDashboard = () => {
  const [events, setEvents] = useState([])
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalTickets: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load dashboard statistics
      const statsData = await ticketService.getDashboardStats()
      
      // Load events
      const eventsData = await eventService.getEvents(0, 5)
      
      setStats({
        totalEvents: statsData.totalEvents || 0,
        totalTickets: statsData.totalTickets || 0,
        totalRevenue: statsData.totalRevenue || 0
      })
      
      setEvents(eventsData.content || [])
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error('Error loading dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return
    }
    
    try {
      await eventService.deleteEvent(eventId)
      // Remove deleted event from the list
      setEvents(events.filter(event => event.id !== eventId))
      // Refresh stats
      loadDashboardData()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete event')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage events and bookings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <FaCalendarAlt className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3">
              <FaTicketAlt className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tickets</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTickets}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3">
              <FaUsers className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Recent Events</h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage your events
              </p>
            </div>
            <Link
              to="/admin/events/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700"
            >
              <FaPlus className="mr-2" />
              Create Event
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="loading-spinner"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new event.
              </p>
              <div className="mt-6">
                <Link
                  to="/admin/events/create"
                  className="btn-primary"
                >
                  <FaPlus className="mr-2" />
                  Create Event
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Seats
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {event.date ? formatDate(event.date) : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {event.category || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${event.price?.toFixed(2) || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.seats || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/admin/events/${event.id}/edit`}
                          className="text-primary hover:text-blue-900 mr-3"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
```

### Services

#### authService.js
```javascript
import api from './api'

class AuthService {
  // Store authentication tokens and user data
  setAuthData(userData) {
    try {
      localStorage.setItem('authToken', 'true'); // Using a simple token for this session-based auth
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userRole', userData.role);
      return true;
    } catch (error) {
      console.error('Error storing auth data:', error);
      return false;
    }
  }

  // Get authentication token
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  // Get user role
  getUserRole() {
    return localStorage.getItem('userRole');
  }

  // Get user data
  getUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getAuthToken();
  }

  // Check if user has specific role
  hasRole(role) {
    return this.getUserRole() === role;
  }

  // Clear authentication data
  clearAuthData() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
  }

  // Get CSRF token
  async getCsrfToken() {
    try {
      const response = await api.get('/v1/auth/csrf');
      return response.data;
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
      return null;
    }
  }

  // Login user
  async login(credentials) {
    try {
      // Get CSRF token before login
      await this.getCsrfToken();
      
      const response = await api.post('/v1/auth/login', credentials);
      if (response.data) {
        this.setAuthData(response.data);
        return response.data;
      }
      throw new Error('Login failed');
    } catch (error) {
      // Only clear auth data on explicit authentication failures (401/403)
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        this.clearAuthData();
      }
      throw error;
    }
  }

  // Register user
  async register(userData) {
    try {
      // Get CSRF token before registration
      await this.getCsrfToken();
      
      const response = await api.post('/v1/auth/signup', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      // Throw the entire error so the calling component can access more details
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      await api.post('/v1/auth/logout');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      this.clearAuthData();
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const response = await api.get('/v1/auth/me');
      if (response.data) {
        this.setAuthData(response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      this.clearAuthData();
      throw error;
    }
  }
}

export default new AuthService()
```

#### ticketService.js
```javascript
import api from './api'

class TicketService {
  // Book tickets
  async bookTicket(bookingData) {
    try {
      const response = await api.post('/v1/tickets/book', bookingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get user tickets with pagination
  async getUserTickets(page = 0, size = 10) {
    try {
      const response = await api.get(`/v1/tickets/user?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get all user tickets as list
  async getUserTicketsList() {
    try {
      const response = await api.get('/v1/tickets/user/list');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Cancel ticket
  async cancelTicket(ticketId) {
    try {
      const response = await api.delete(`/v1/tickets/${ticketId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get event tickets (admin only)
  async getEventTickets(eventId, page = 0, size = 10) {
    try {
      const response = await api.get(`/v1/tickets/admin/event/${eventId}?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Get dashboard statistics (admin only)
  async getDashboardStats() {
    try {
      const response = await api.get('/v1/tickets/admin/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new TicketService()
```

### State Management
- Local component state using React hooks (useState, useEffect)
- Form state management using react-hook-form
- Authentication state stored in localStorage
- Global state for user authentication status

### UI/UX Design Patterns
- Responsive design using Tailwind CSS
- Consistent component structure and styling
- Form validation with real-time feedback
- Loading states and error handling
- Protected routes based on user roles
- Intuitive navigation and user flows
- Accessible UI components with proper ARIA attributes

### API Integration
- Axios for HTTP requests
- Centralized API configuration with interceptors
- Error handling and response normalization
- CSRF token management
- Session-based authentication with cookies
