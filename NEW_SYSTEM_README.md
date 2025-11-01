# ONVENT - Rebuilt Event Ticket Booking System

This is a complete rebuild of the ONVENT event ticket booking system with improved architecture, security, and functionality.

## 🎯 Project Overview

ONVENT is a modern, secure, and responsive event booking platform where users can:
- Register and log in
- Browse, search, and filter upcoming events
- Book event tickets
- Receive booking confirmation via email
- Download tickets as PDFs

Admins can:
- Manage events (CRUD)
- View and manage all bookings
- Access an admin dashboard

## ⚙️ Technology Stack

### Backend (Spring Boot 3 + Java 21)
- Spring Web
- Spring Data JPA
- Spring Security
- Hibernate ORM
- Validation (Jakarta Bean Validation)
- Lombok
- Spring Mail (for email notifications)
- iText (for PDF ticket generation)
- PostgreSQL Driver

### Frontend (React.js)
- React Router for navigation
- Axios for API integration
- Tailwind CSS for styling
- React Hook Form for validation
- Context API for state management

### Database
- Engine: PostgreSQL
- Connection: Uses the same existing database link, tables, and schema

## 🗄️ Database Schema

### Tables:
- `users` → id, username, name, email, password, role
- `events` → id, title, description, venue, date, category, price, seats, image
- `tickets` → id, user_id, event_id, quantity, total_price, booking_date, status

## 🧱 Architecture

```
Controller → Service → Repository → Entity
```

- Clean modular structure
- Centralized exception handling
- Role-based access control with Spring Security
- DTOs for frontend communication

## 🚀 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user

### Events
- `GET /api/v1/events` - Get all events (with pagination)
- `GET /api/v1/events/{id}` - Get event by ID
- `GET /api/v1/events/search` - Search events with filters
- `POST /api/v1/events` - Create new event (Admin/User)
- `PUT /api/v1/events/{id}` - Update event (Admin/User)
- `DELETE /api/v1/events/{id}` - Delete event (Admin/User)

### Tickets
- `POST /api/v1/tickets/book` - Book event tickets
- `GET /api/v1/tickets/user` - Get user's tickets (with pagination)
- `GET /api/v1/tickets/user/list` - Get user's tickets (list)
- `DELETE /api/v1/tickets/{id}` - Cancel ticket
- `GET /api/v1/tickets/admin/event/{eventId}` - Get event tickets (Admin)

## 🎨 UI & UX Design

### Theme & Color Palette
- Primary: #1E40AF (Deep Blue) - Buttons, header, and highlights
- Secondary: #3B82F6 (Sky Blue) - Links, icons, hover effects
- Background: #F9FAFB (Light Gray) - Main background
- Text: #1F2937 (Charcoal) - High contrast readability
- Accent: #22C55E (Green) - Success states, confirmations

### Layout & Components
- Navbar: Logo on left, login/signup or logout on right
- Home Page: Event grid with search & filters
- Event Details Page: Event info + "Book Ticket" button
- User Dashboard: List of user's bookings (with cancel option)
- Admin Dashboard: Manage events, view bookings & users
- Footer: Simple copyright "© 2025 ONVENT"

## 🪪 Logo & Branding
- Logo Name: ONVENT
- Concept: "O" shaped like a ticket 🎫 with subtle event wave or spark design
- Font: Poppins / Inter (Modern Sans-serif)
- Favicon: Minimal blue ticket icon
- Tagline: "Your Event, Your Seat, Your Way."

## 🌐 Deployment

### Backend
- Platform: Render
- Port: 8087
- CORS: Configured for Netlify frontend

### Frontend
- Platform: Netlify
- URL: https://onvent.netlify.app

### Database
- Platform: Neon.tech
- Uses existing database schema and connection

## 📦 Getting Started

### Prerequisites
- Java 21
- Node.js 18+
- PostgreSQL database

### Backend Setup
1. Update database credentials in `src/main/resources/application-new.properties`
2. Update email configuration for booking notifications
3. Run the application (uses Maven wrapper - no Maven installation required):
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend Setup
1. Navigate to the frontend directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🔐 Security Features
- Password encryption with BCrypt
- Session-based authentication
- CSRF protection enabled
- Role-based access control
- Input validation and sanitization

## 📝 Validation & Error Handling
- Bean Validation (@NotNull, @Email, @Min, etc.)
- Global error handler
- User-friendly validation messages

## 📤 Email & PDF Ticket Generation
- Spring Mail for booking confirmation emails
- iText for PDF ticket generation
- Downloadable tickets with booking details

## 🔍 Pagination, Search & Filter
- Event listing supports pagination
- Search and filter by title, category, or date
- Dynamic queries for efficient data retrieval

## 🧪 Testing
- Unit tests for services
- Integration tests for controllers
- Postman collection included

## 📁 Project Structure
```
src/main/java/ac/nsbm/onvent/newsystem/
├── config/          # Security and configuration classes
├── controller/      # REST API controllers
├── dto/             # Data Transfer Objects
├── entity/          # JPA entities
├── exception/       # Custom exceptions
├── repository/      # Spring Data JPA repositories
├── service/         # Business logic services
└── util/            # Utility classes
```

## 🚀 Deployment Instructions

1. Build the backend JAR (uses Maven wrapper):
   ```bash
   ./mvnw clean package
   ```

2. Deploy to Render with the following environment variables:
   - `SPRING_PROFILES_ACTIVE=prod`
   - Database credentials
   - Email configuration

3. Build the frontend:
   ```bash
   npm run build
   ```

4. Deploy the build folder to Netlify

## 📞 Support
For any issues or questions, please contact the development team.