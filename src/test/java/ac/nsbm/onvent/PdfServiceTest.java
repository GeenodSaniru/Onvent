package ac.nsbm.onvent;

import ac.nsbm.onvent.model.dto.BookingResponse;
import ac.nsbm.onvent.service.PdfService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class PdfServiceTest {

    @Test
    public void testGenerateTicketPdf() {
        // Create a sample booking response
        BookingResponse booking = new BookingResponse();
        booking.setTicketId(1L);
        booking.setTicketCode("TKT-ABC123");
        booking.setUserId(1L);
        booking.setUserName("John Doe");
        booking.setEventId(1L);
        booking.setEventTitle("Test Event");
        booking.setEventLocation("Test Venue");
        booking.setEventDate(LocalDateTime.now().plusDays(7));
        booking.setEventPrice(50.0);
        booking.setPurchaseDate(LocalDateTime.now());
        booking.setStatus("ACTIVE");
        booking.setAvailableSeats(99);

        // Create PDF service
        PdfService pdfService = new PdfService();

        // Generate PDF
        assertDoesNotThrow(() -> {
            byte[] pdfContent = pdfService.generateTicketPdf(booking);
            assertNotNull(pdfContent);
            assertTrue(pdfContent.length > 0);
        });
    }
}