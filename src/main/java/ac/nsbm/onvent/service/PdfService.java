package ac.nsbm.onvent.service;

import ac.nsbm.onvent.model.dto.BookingResponse;
import com.itextpdf.barcodes.BarcodeQRCode;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.layout.element.Image;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {

    /**
     * Generate PDF ticket for a booking
     * @param booking The booking details
     * @return Byte array containing the PDF content
     */
    public byte[] generateTicketPdf(BookingResponse booking) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Add title
            document.add(new Paragraph("EVENT TICKET")
                    .setFontSize(24)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20));

            // Add event details table
            Table eventTable = new Table(UnitValue.createPercentArray(new float[]{1, 2}))
                    .setWidth(UnitValue.createPercentValue(100))
                    .setMarginBottom(20);

            eventTable.addHeaderCell(createHeaderCell("Event"));
            eventTable.addHeaderCell(createHeaderCell(booking.getEventTitle()));

            eventTable.addCell(createCell("Date"));
            eventTable.addCell(createCell(booking.getEventDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))));

            eventTable.addCell(createCell("Venue"));
            eventTable.addCell(createCell(booking.getVenue()));

            eventTable.addCell(createCell("Organized by"));
            eventTable.addCell(createCell("Onvent"));

            document.add(eventTable);

            // Add booking details table
            Table bookingTable = new Table(UnitValue.createPercentArray(new float[]{1, 2}))
                    .setWidth(UnitValue.createPercentValue(100))
                    .setMarginBottom(20);

            bookingTable.addHeaderCell(createHeaderCell("Booking Information"));
            bookingTable.addHeaderCell(createHeaderCell(""));

            bookingTable.addCell(createCell("Reference Number"));
            bookingTable.addCell(createCell(booking.getTicketCode()));

            bookingTable.addCell(createCell("Booked By"));
            bookingTable.addCell(createCell(booking.getUserName()));

            bookingTable.addCell(createCell("Booking Date"));
            bookingTable.addCell(createCell(booking.getPurchaseDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))));

            bookingTable.addCell(createCell("Status"));
            bookingTable.addCell(createCell(booking.getStatus()));

            document.add(bookingTable);

            // Add QR code
            document.add(new Paragraph("Verification QR Code")
                    .setFontSize(14)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(10));

            // Generate QR code with booking reference
            BarcodeQRCode qrCode = new BarcodeQRCode(booking.getTicketCode());
            Image qrCodeImage = new Image(qrCode.createFormXObject(pdf))
                    .setWidth(150)
                    .setHeight(150)
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(qrCodeImage);

            // Add footer
            document.add(new Paragraph("Please present this ticket at the entrance. Keep this ticket safe as duplicates will not be issued.")
                    .setFontSize(10)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(20)
                    .setFontColor(com.itextpdf.kernel.colors.ColorConstants.GRAY));

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF ticket: " + e.getMessage(), e);
        }
    }

    /**
     * Create a header cell with styling
     * @param content The cell content
     * @return Styled cell
     */
    private Cell createHeaderCell(String content) {
        return new Cell()
                .add(new Paragraph(content).setBold())
                .setBackgroundColor(com.itextpdf.kernel.colors.ColorConstants.LIGHT_GRAY)
                .setTextAlignment(TextAlignment.LEFT);
    }

    /**
     * Create a regular cell with styling
     * @param content The cell content
     * @return Styled cell
     */
    private Cell createCell(String content) {
        return new Cell().add(new Paragraph(content));
    }
}