package ac.nsbm.onvent.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendBookingConfirmation(String to, String subject, String text, byte[] pdfAttachment) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text, true); // true indicates HTML content

            if (pdfAttachment != null) {
                ByteArrayResource pdfResource = new ByteArrayResource(pdfAttachment);
                helper.addAttachment("ticket.pdf", pdfResource);
            }

            mailSender.send(message);
            log.info("Booking confirmation email sent successfully to: {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send booking confirmation email to: {}", to, e);
            throw new RuntimeException("Failed to send email", e);
        }
    }
}