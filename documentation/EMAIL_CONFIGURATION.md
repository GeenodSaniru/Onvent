# Email Configuration for Onvent Application

## Overview
The Onvent application now includes automated email confirmations for ticket bookings. This feature uses Spring's JavaMailSender to send HTML formatted emails with booking details.

## Configuration

### 1. Update application.properties
Modify the following properties in `src/main/resources/application.properties`:

```properties
# Email configuration for booking confirmations
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

### 2. Gmail Specific Configuration
If using Gmail:
1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this app password as the `spring.mail.password` value

### 3. Other Email Providers
For other providers, update the host and port accordingly:
- **Outlook/Hotmail**: `smtp-mail.outlook.com:587`
- **Yahoo**: `smtp.mail.yahoo.com:587`
- **Custom SMTP**: Use your provider's SMTP settings

## Email Content
The booking confirmation email includes:
- Event name and date
- Venue information
- Booking reference number
- Number of tickets
- Total price
- Important information section

## Error Handling
Email sending failures are handled gracefully:
- Errors are logged but don't interrupt the booking process
- Users still receive booking confirmation through the API response

## Testing
To test email functionality:
1. Configure valid email credentials
2. Make a booking request through the API
3. Check the recipient's inbox for the confirmation email

## PDF Ticket Generation
Users can download their tickets as PDF files:
- Endpoint: `GET /tickets/{ticketId}/pdf`
- Includes event details, booking information, and a QR code
- PDF is generated on-demand and sent as an attachment