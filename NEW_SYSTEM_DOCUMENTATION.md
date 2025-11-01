# ONVENT - New System Documentation

## 🎯 Overview

This document provides comprehensive documentation for the rebuilt ONVENT event ticket booking system. The new system addresses all the issues identified in the previous implementation and follows modern best practices for both backend and frontend development.

## 🏗️ Architecture

### Backend Architecture
```
src/main/java/ac/nsbm/onvent/newsystem/
├── config/          # Security and configuration classes
├── controller/      # REST API controllers
├── dto/             # Data Transfer Objects
├── entity/          # JPA entities
├── repository/      # Spring Data JPA repositories
├── service/         # Business logic services
└── util/            # Utility classes
```

### Frontend Architecture
```
frontend/onvent-new/
├── src/
│   ├── components/  # Reusable UI components
│   ├── pages/       # Page components
│   ├── services/    # API service classes
│   ├── contexts/    # React context providers
│   ├── utils/       # Utility functions
│   ├── assets/      # Static assets
│   ├── App.jsx      # Main application component
│   ├── main.jsx     # Application entry point
│   └── index.css    # Global styles
├── public/          # Public assets
├── package.json     # Dependencies and scripts
├── vite.config.js   # Vite configuration
├── tailwind.config.js # Tailwind CSS configuration
└── postcss.config.js  # PostCSS configuration
```

## 🔐 Authentication & Authorization

### Session-Based Authentication
The new system implements session-based authentication with the following features:
- Secure password hashing using BCrypt
- Role-based access control (USER and ADMIN roles)
- CSRF protection for SPA applications
- Session timeout management
- Secure credential storage

### Protected Routes
The frontend implements protected routes that:
- Check authentication status before rendering content
- Redirect unauthenticated users to login
- Redirect users with incorrect roles to appropriate dashboards
- Provide loading states during authentication checks

## 🗄️ Database Schema

### Users Table
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

### Events Table
```sql
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    venue VARCHAR(255) NOT NULL,
    date TIMESTAMP(6) NOT NULL,
    category VARCHAR(255) NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    seats INTEGER NOT NULL,
    image VARCHAR(255)
);
```

### Tickets Table
```sql
CREATE TABLE tickets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL,
    total_price DOUBLE PRECISION NOT NULL,
    booking_date TIMESTAMP(6) NOT NULL,
    status VARCHAR(255) NOT NULL,
    CONSTRAINT fk_tickets_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_tickets_event FOREIGN KEY (event_id) REFERENCES events(id)
);
```

## 🚀 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/signup` | User registration |
| POST | `/api/v1/auth/login` | User login |
| POST | `/api/v1/auth/logout` | User logout |
| GET | `/api/v1/auth/me` | Get current user |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/events` | Get all events (paginated) |
| GET | `/api/v1/events/{id}` | Get event by ID |
| GET | `/api/v1/events/search` | Search events with filters |
| POST | `/api/v1/events` | Create new event |
| PUT | `/api/v1/events/{id}` | Update event |
| DELETE | `/api/v1/events/{id}` | Delete event |

### Tickets
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/tickets/book` | Book event tickets |
| GET | `/api/v1/tickets/user` | Get user's tickets (paginated) |
| GET | `/api/v1/tickets/user/list` | Get user's tickets (list) |
| DELETE | `/api/v1/tickets/{id}` | Cancel ticket |
| GET | `/api/v1/tickets/admin/event/{eventId}` | Get event tickets (admin) |

## 🎨 UI Components

### Authentication Components
- **Login Form**: Secure login with validation
- **Registration Form**: User registration with password validation
- **ProtectedRoute**: Component for protecting routes based on authentication and roles

### Event Components
- **Event List**: Grid view of events with search and filtering
- **Event Details**: Detailed view of event information
- **Booking Form**: Form for booking event tickets

### Dashboard Components
- **User Dashboard**: View and manage booked tickets
- **Admin Dashboard**: Manage events and view statistics

### Navigation Components
- **Navbar**: Main navigation with authentication status
- **Footer**: Site footer with copyright information

## 🛠️ Services

### Backend Services
- **UserService**: User management and authentication
- **EventService**: Event management and search
- **TicketService**: Ticket booking and management

### Frontend Services
- **AuthService**: Authentication and user management
- **EventService**: Event API interactions
- **TicketService**: Ticket API interactions
- **ApiService**: Base API configuration and interceptors

## 🔧 Configuration

### Backend Configuration
- **SecurityConfig**: Spring Security configuration
- **CustomUserDetailsService**: User details service for authentication
- **Application Properties**: Database and server configuration

### Frontend Configuration
- **Vite Config**: Build and development server configuration
- **Tailwind Config**: CSS framework configuration
- **PostCSS Config**: CSS processing configuration

## 🧪 Testing

### Backend Testing
- Unit tests for services
- Integration tests for controllers
- Repository tests for data access

### Frontend Testing
- Component tests for UI elements
- Integration tests for API services
- End-to-end tests for user flows

## 🚀 Deployment

### Backend Deployment
1. Build the JAR file (uses Maven wrapper - no Maven installation required):
   ```bash
   ./mvnw clean package
   ```
2. Deploy to hosting platform (Render, Heroku, etc.)
3. Set environment variables for database and email configuration

### Frontend Deployment
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Deploy to hosting platform (Netlify, Vercel, etc.)
3. Configure environment variables if needed

## 📈 Performance Optimization

### Backend Optimizations
- Database connection pooling with HikariCP
- Lazy loading for entity relationships
- Pagination for large data sets
- Caching strategies for frequently accessed data

### Frontend Optimizations
- Code splitting for faster initial loads
- Image optimization and lazy loading
- Efficient state management with React Context
- Memoization of expensive computations

## 🔒 Security Features

### Backend Security
- Password encryption with BCrypt
- CSRF protection for forms
- Input validation and sanitization
- Role-based access control
- Secure session management

### Frontend Security
- XSS prevention through proper data binding
- Secure storage of authentication tokens
- Input validation and sanitization
- Protection against clickjacking

## 📞 Support and Maintenance

### Monitoring
- Application logging for debugging
- Performance monitoring
- Error tracking and reporting

### Updates
- Regular dependency updates
- Security patches
- Feature enhancements

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://reactjs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)

## 🆘 Troubleshooting

### Common Issues
1. **Database Connection Errors**: Check database credentials and network connectivity
2. **Authentication Failures**: Verify user credentials and session configuration
3. **API Errors**: Check server logs and network requests
4. **Frontend Build Issues**: Verify Node.js version and dependencies

### Getting Help
For issues not covered in this documentation, please:
1. Check the application logs for error messages
2. Review the console output for frontend errors
3. Consult the framework documentation
4. Contact the development team