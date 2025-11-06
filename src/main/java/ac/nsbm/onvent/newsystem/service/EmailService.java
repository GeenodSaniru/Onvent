package ac.nsbm.onvent.newsystem.service;

import ac.nsbm.onvent.newsystem.dto.BookingResponse;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Send booking confirmation email to the user
     * @param bookingResponse The booking details
     * @param userEmail The email address of the user
     */
    public void sendBookingConfirmation(BookingResponse bookingResponse, String userEmail) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(userEmail);
            helper.setSubject("Booking Confirmation - " + bookingResponse.getEventTitle());

            String htmlContent = buildBookingConfirmationEmail(bookingResponse);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            logger.info("Booking confirmation email sent successfully to {}", userEmail);
        } catch (MessagingException e) {
            logger.error("Failed to send booking confirmation email to {}: {}", userEmail, e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error while sending booking confirmation email to {}: {}", userEmail, e.getMessage());
        }
    }

    /**
     * Build HTML content for booking confirmation email
     * @param booking The booking details
     * @return HTML content as string
     */
    private String buildBookingConfirmationEmail(BookingResponse booking) {
        StringBuilder html = new StringBuilder();
        
        html.append("<!DOCTYPE html>");
        html.append("<html>");
        html.append("<head>");
        html.append("<meta charset='UTF-8'>");
        html.append("<title>Booking Confirmation</title>");
        html.append("</head>");
        html.append("<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>");
        
        html.append("<div style='max-width: 600px; margin: 0 auto; padding: 20px;'>");
        html.append("<h1 style='color: #2c3e50; text-align: center;'>Booking Confirmation</h1>");
        
        html.append("<div style='background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;'>");
        html.append("<h2 style='color: #3498db; margin-top: 0;'>").append(escapeHtml(booking.getEventTitle())).append("</h2>");
        html.append("<p><strong>Date:</strong> ").append(booking.getEventDate().toString()).append("</p>");
        html.append("<p><strong>Venue:</strong> ").append(escapeHtml(booking.getEventLocation())).append("</p>");
        html.append("</div>");
        
        html.append("<div style='background-color: #e8f4fc; padding: 20px; border-radius: 5px; margin-bottom: 20px;'>");
        html.append("<h3 style='color: #2c3e50; margin-top: 0;'>Booking Details</h3>");
        html.append("<p><strong>Booking Reference:</strong> ").append(booking.getTicketCode()).append("</p>");
        html.append("<p><strong>Number of Tickets:</strong> 1</p>");
        html.append("<p><strong>Total Price:</strong> $").append(String.format("%.2f", booking.getEventPrice())).append("</p>");
        html.append("<p><strong>Booking Status:</strong> ").append(booking.getStatus()).append("</p>");
        html.append("</div>");
        
        html.append("<div style='background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin-bottom: 20px;'>");
        html.append("<h3 style='color: #856404; margin-top: 0;'>Important Information</h3>");
        html.append("<p>Please keep this booking reference number handy for event entry.</p>");
        html.append("<p>Arrive at least 30 minutes before the event starts.</p>");
        html.append("</div>");
        
        html.append("<p style='text-align: center; color: #6c757d; font-size: 0.9em;'>");
        html.append("If you have any questions about your booking, please contact our support team.<br>");
        html.append("Thank you for choosing our service!");
        html.append("</p>");
        
        html.append("</div>");
        html.append("</body>");
        html.append("</html>");
        
        return html.toString();
    }
    
    /**
     * Escape HTML special characters to prevent XSS
     * @param input The input string
     * @return Escaped string
     */
    private String escapeHtml(String input) {
        if (input == null) return "";
        return input.replace("&", "&amp;")
                   .replace("<", "&lt;")
                   .replace(">", "&gt;")
                   .replace("\"", "&quot;")
                   .replace("'", "&#x27;");
    }
}