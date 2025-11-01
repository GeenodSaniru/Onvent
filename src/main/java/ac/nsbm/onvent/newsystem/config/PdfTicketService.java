package ac.nsbm.onvent.service;

import ac.nsbm.onvent.model.entity.Ticket;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.io.font.constants.StandardFonts;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class PdfTicketService {

    public byte[] generateTicketPdf(Ticket ticket) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);

            // Create fonts
            PdfFont boldFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
            PdfFont normalFont = PdfFontFactory.createFont(StandardFonts.HELVETICA);
            PdfFont italicFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_OBLIQUE);

            // Title
            document.add(new Paragraph("EVENT TICKET")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(20)
                    .setFontColor(ColorConstants.BLUE)
                    .setFont(boldFont));

            document.add(new Paragraph(" ")
                    .setMarginBottom(20));

            // Generate QR code
            String qrContent = "Ticket ID: " + ticket.getId() + 
                              "\nEvent: " + ticket.getEvent().getTitle() + 
                              "\nAttendee: " + ticket.getUser().getName() +
                              "\nDate: " + ticket.getEvent().getEventDate().toString();
            
            Image qrImage = generateQRCodeImage(qrContent, 100, 100);
            if (qrImage != null) {
                document.add(qrImage.setTextAlignment(TextAlignment.CENTER));
                document.add(new Paragraph(" ")
                        .setMarginBottom(20));
            }

            // Ticket information table
            float[] columnWidths = {1, 2};
            Table table = new Table(UnitValue.createPercentArray(columnWidths));
            table.setWidth(UnitValue.createPercentValue(100));

            // Add ticket details
            table.addHeaderCell(createHeaderCell("Field", boldFont));
            table.addHeaderCell(createHeaderCell("Details", boldFont));

            table.addCell(createCell("Ticket ID", normalFont));
            table.addCell(createCell(ticket.getId().toString(), normalFont));

            table.addCell(createCell("Event Name", normalFont));
            table.addCell(createCell(ticket.getEvent().getTitle(), normalFont));

            table.addCell(createCell("Event Date", normalFont));
            table.addCell(createCell(ticket.getEvent().getEventDate().toString(), normalFont));

            table.addCell(createCell("Location", normalFont));
            table.addCell(createCell(ticket.getEvent().getLocation(), normalFont));

            table.addCell(createCell("Attendee Name", normalFont));
            table.addCell(createCell(ticket.getUser().getName(), normalFont));

            table.addCell(createCell("Booking Date", normalFont));
            table.addCell(createCell(ticket.getPurchaseDate().toString(), normalFont));

            table.addCell(createCell("Ticket Code", normalFont));
            table.addCell(createCell(ticket.getTicketCode(), normalFont));

            table.addCell(createCell("Total Price", normalFont));
            table.addCell(createCell("$" + ticket.getEvent().getPrice(), normalFont));

            document.add(table);

            // Footer note
            document.add(new Paragraph(" ")
                    .setMarginTop(20));

            document.add(new Paragraph("Thank you for booking with Onvent!")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFont(italicFont));

            document.close();

            log.info("PDF ticket generated successfully for ticket ID: {}", ticket.getId());
            return baos.toByteArray();
        } catch (Exception e) {
            log.error("Failed to generate PDF ticket for ticket ID: {}", ticket.getId(), e);
            throw new RuntimeException("Failed to generate PDF ticket", e);
        }
    }

    private Image generateQRCodeImage(String text, int width, int height) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
            
            BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height, hints);
            
            ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
            com.google.zxing.client.j2se.MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
            
            ImageData qrCodeImageData = ImageDataFactory.create(pngOutputStream.toByteArray());
            Image qrCodeImage = new Image(qrCodeImageData);
            qrCodeImage.setWidth(width);
            qrCodeImage.setHeight(height);
            
            return qrCodeImage;
        } catch (WriterException | IOException e) {
            log.error("Failed to generate QR code", e);
            return null;
        }
    }

    private Cell createHeaderCell(String content, PdfFont font) {
        Cell cell = new Cell()
                .add(new Paragraph(content).setFont(font))
                .setBackgroundColor(ColorConstants.LIGHT_GRAY);
        return cell;
    }

    private Cell createCell(String content, PdfFont font) {
        return new Cell().add(new Paragraph(content).setFont(font));
    }
}