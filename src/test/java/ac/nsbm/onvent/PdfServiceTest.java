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
        // Create a sample booking response using builder
        BookingResponse booking = BookingResponse.builder()
                .id(1L)
                .ticketCode("TKT-ABC123")
                .userId(1L)
                .userName("John Doe")
                .userEmail("john.doe@example.com")
                .eventId(1L)
                .eventTitle("Test Event")
                .venue("Test Venue")
                .eventDate(LocalDateTime.now().plusDays(7))
                .purchaseDate(LocalDateTime.now())
                .status("ACTIVE")
                .remainingSeats(99)
                .build();

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