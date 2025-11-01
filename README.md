# ONVENT - Event Ticket Booking System (Rebuilt)

🎫 A modern, secure, and responsive event booking platform rebuilt from scratch.

## 🚀 Quick Start

### Prerequisites
- Java 21+
- Node.js 18+
- PostgreSQL database (using existing connection)

### Backend Setup
```bash
# Make the initialization script executable
chmod +x init-dev-backend.sh

# Run the backend development server (uses Maven wrapper - no Maven installation required)
./init-dev-backend.sh
```

The backend will start on port 8087.

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend/onvent-new

# Make the initialization script executable
chmod +x init-dev.sh

# Run the frontend development server
./init-dev.sh
```

The frontend will start on port 5174.

## 🏗️ System Architecture

### Backend (Spring Boot 3 + Java 21)
- **Security**: Session-based authentication with Spring Security
- **Data**: JPA/Hibernate with PostgreSQL
- **API**: RESTful endpoints with proper validation
- **Architecture**: Clean modular structure (Controller → Service → Repository → Entity)

### Frontend (React.js + Vite)
- **Framework**: React 18 with Vite build tool
- **Routing**: React Router for navigation
- **Styling**: Tailwind CSS for responsive design
- **Forms**: React Hook Form for validation
- **API**: Axios for HTTP requests

## 🗂️ Project Structure

```
.
├── src/main/java/ac/nsbm/onvent/newsystem/    # Backend source code
│   ├── config/          # Security and configuration
│   ├── controller/      # REST API controllers
│   ├── dto/             # Data Transfer Objects
│   ├── entity/          # JPA entities
│   ├── repository/      # Data access interfaces
│   ├── service/         # Business logic
│   └── util/            # Utility classes
│
├── frontend/onvent-new/                       # Frontend source code
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service classes
│   │   ├── contexts/    # React context providers
│   │   ├── utils/       # Utility functions
│   │   ├── assets/      # Static assets
│   │   ├── App.jsx      # Main application component
│   │   ├── main.jsx     # Application entry point
│   │   └── index.css    # Global styles
│   └── ...
│
├── src/main/resources/                        # Backend resources
│   ├── db/migration/    # Database migration scripts
│   └── application-new.properties # Configuration
│
├── NEW_SYSTEM_README.md                       # Backend documentation
├── NEW_SYSTEM_DOCUMENTATION.md                # Comprehensive documentation
├── NEW_SYSTEM_SUMMARY.md                      # Implementation summary
├── ONVENT_NEW_API.postman_collection.json     # API testing collection
└── ...
```

## 🔐 Authentication & Authorization

### User Roles
- **USER**: Can browse events, book tickets, and manage their bookings
- **ADMIN**: All USER capabilities plus event management and system administration

### Authentication Flow
1. Users register with username, email, name, and password
2. First user automatically gets ADMIN role
3. Users login with username/email and password
4. Session-based authentication with CSRF protection
5. Role-based route protection on both frontend and backend

## 🎨 UI/UX Features

### Color Palette
- Primary: #1E40AF (Deep Blue)
- Secondary: #3B82F6 (Sky Blue)
- Background: #F9FAFB (Light Gray)
- Text: #1F2937 (Charcoal)
- Accent: #22C55E (Green)

### Responsive Design
- Mobile-first approach
- Grid-based layout
- Adaptive components
- Touch-friendly interface

## 📚 Documentation

### Comprehensive Guides
- [NEW_SYSTEM_README.md](NEW_SYSTEM_README.md) - Backend overview
- [NEW_SYSTEM_DOCUMENTATION.md](NEW_SYSTEM_DOCUMENTATION.md) - Detailed documentation
- [NEW_SYSTEM_SUMMARY.md](NEW_SYSTEM_SUMMARY.md) - Implementation summary
- [frontend/onvent-new/README.md](frontend/onvent-new/README.md) - Frontend documentation

### API Testing
- [ONVENT_NEW_API.postman_collection.json](ONVENT_NEW_API.postman_collection.json) - Postman collection

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
1. Build the JAR file:
   ```bash
   ./mvnw clean package
   ```
2. Deploy to hosting platform (Render, Heroku, etc.)
3. Set environment variables for production

### Frontend Deployment
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Deploy to hosting platform (Netlify, Vercel, etc.)
3. Configure environment variables if needed

## 📈 Key Features

### For Users
- 🔍 Browse and search events
- 🎫 Book event tickets
- 👤 Manage personal bookings
- 📱 Responsive mobile experience

### For Administrators
- 📊 Admin dashboard
- 🎟️ Event management (CRUD)
- 📋 View all bookings
- 👥 User management

### Technical Features
- 🔒 Secure authentication
- 🛡️ CSRF protection
- 📦 Modular architecture
- ⚡ Fast development with Vite
- 🎨 Modern UI with Tailwind CSS

## 🆘 Support

### Getting Help
- Check the documentation files in this repository
- Review the console output for error messages
- Consult the framework documentation
- Contact the development team

### Reporting Issues
- Create detailed bug reports
- Include steps to reproduce
- Provide screenshots if applicable
- Specify environment details

## 📄 License

This project is proprietary and confidential. All rights reserved.

---

**🎉 Congratulations!** You now have a fully functional, modern event ticket booking system with improved architecture, security, and user experience.