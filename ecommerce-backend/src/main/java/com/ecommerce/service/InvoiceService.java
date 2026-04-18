package com.ecommerce.service;

import com.ecommerce.model.Order;
import com.ecommerce.model.OrderItem;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class InvoiceService {

    public byte[] generateInvoice(Order order) {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter writer = PdfWriter.getInstance(document, out);
            document.open();

            // Colors
            Color primaryColor = new Color(75, 0, 130); // Indigo
            Color accentColor = new Color(230, 230, 250); // Lavender

            // Fonts
            Font logoFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24, primaryColor);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.BLACK);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);
            Font smallBoldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.BLACK);
            Font addressFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.GRAY);

            // 1. Company Header
            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);

            // Logo / Company Name
            PdfPCell logoCell = new PdfPCell(new Phrase("LuxeMart", logoFont));
            logoCell.setBorder(Rectangle.NO_BORDER);
            logoCell.setVerticalAlignment(Element.ALIGN_MIDDLE);

            // Company Address (Right aligned)
            PdfPCell companyAddrCell = new PdfPCell();
            companyAddrCell.setBorder(Rectangle.NO_BORDER);
            companyAddrCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            companyAddrCell.addElement(new Paragraph("LuxeMart Inc.", smallBoldFont));
            companyAddrCell.addElement(new Paragraph("123 Fashion Avenue, New Delhi, India", addressFont));
            companyAddrCell.addElement(new Paragraph("www.luxemart.com | support@luxemart.com", addressFont));

            headerTable.addCell(logoCell);
            headerTable.addCell(companyAddrCell);
            document.add(headerTable);

            document.add(new Paragraph("\n"));

            // Divider
            document.add(
                    new Paragraph("INVOICE", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, Color.DARK_GRAY)));
            document.add(new Paragraph("\n"));

            // 2. Order & Customer Details (2 Columns)
            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);
            infoTable.setSpacingAfter(20);

            // Column 1: Billing/Shipping To
            PdfPCell customerCell = new PdfPCell();
            customerCell.setBorder(Rectangle.NO_BORDER);
            customerCell.addElement(new Paragraph("BILL TO:", smallBoldFont));

            String customerName = "Valued Customer";
            if (order.getUser() != null) {
                String fName = order.getUser().getFirstName();
                String lName = order.getUser().getLastName();
                String fullName = order.getUser().getName();

                if (fName != null && !fName.trim().isEmpty() && !fName.equals("null")) {
                    customerName = fName + " " + (lName != null && !lName.equals("null") ? lName : "");
                } else if (fullName != null && !fullName.trim().isEmpty()) {
                    customerName = fullName;
                }
            }
            customerCell.addElement(new Paragraph(customerName, normalFont));

            if (order.getUser() != null && order.getUser().getEmail() != null) {
                customerCell.addElement(new Paragraph(order.getUser().getEmail(), normalFont));
            }

            if (order.getShippingAddress() != null) {
                customerCell.addElement(new Paragraph(order.getShippingAddress(), normalFont));
            }

            // Column 2: Order Details
            PdfPCell orderCell = new PdfPCell();
            orderCell.setBorder(Rectangle.NO_BORDER);
            orderCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

            PdfPTable orderDetailsInternal = new PdfPTable(2);
            orderDetailsInternal.setWidthPercentage(100);
            orderDetailsInternal.setHorizontalAlignment(Element.ALIGN_RIGHT);

            addDetailRow(orderDetailsInternal, "Order ID:", "#" + order.getOrderId(), smallBoldFont, normalFont);
            addDetailRow(orderDetailsInternal, "Date:",
                    order.getOrderDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy")), smallBoldFont, normalFont);
            addDetailRow(orderDetailsInternal, "Status:", order.getStatus(), smallBoldFont, normalFont);
            addDetailRow(orderDetailsInternal, "Payment Method:", order.getPaymentMethod(), smallBoldFont, normalFont);

            orderCell.addElement(orderDetailsInternal);

            infoTable.addCell(customerCell);
            infoTable.addCell(orderCell);

            document.add(infoTable);

            // 3. Items Table
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setWidths(new float[] { 4, 1, 2, 2 }); // Product, Qty, Price, Total
            table.setHeaderRows(1);

            // Table Header
            addTableHeader(table, "Product Description", smallBoldFont, accentColor);
            addTableHeader(table, "Qty", smallBoldFont, accentColor);
            addTableHeader(table, "Unit Price", smallBoldFont, accentColor);
            addTableHeader(table, "Total", smallBoldFont, accentColor);

            // Table Rows
            double subtotal = 0;
            for (OrderItem item : order.getItems()) {
                table.addCell(createCell(item.getProduct().getName(), normalFont, Element.ALIGN_LEFT));
                table.addCell(createCell(String.valueOf(item.getQuantity()), normalFont, Element.ALIGN_CENTER));
                table.addCell(
                        createCell("INR " + String.format("%.2f", item.getPrice()), normalFont, Element.ALIGN_RIGHT));

                double lineTotal = item.getPrice() * item.getQuantity();
                table.addCell(createCell("INR " + String.format("%.2f", lineTotal), normalFont, Element.ALIGN_RIGHT));
                subtotal += lineTotal;
            }

            document.add(table);

            // 4. Totals Calculation
            PdfPTable totalTable = new PdfPTable(2);
            totalTable.setWidthPercentage(40);
            totalTable.setHorizontalAlignment(Element.ALIGN_RIGHT);
            totalTable.setSpacingBefore(10);

            addTotalRow(totalTable, "Subtotal:", "INR " + String.format("%.2f", subtotal), normalFont);

            if (order.getDiscountAmount() != null && order.getDiscountAmount() > 0) {
                addTotalRow(totalTable, "Discount:", "- INR " + String.format("%.2f", order.getDiscountAmount()),
                        normalFont);
            }

            // Grand Total
            PdfPCell totalLabel = new PdfPCell(new Phrase("GRAND TOTAL:", smallBoldFont));
            totalLabel.setBorder(Rectangle.TOP);
            totalLabel.setPaddingTop(5);
            totalLabel.setHorizontalAlignment(Element.ALIGN_RIGHT);

            PdfPCell totalValue = new PdfPCell(
                    new Phrase("INR " + String.format("%.2f", order.getTotalAmount()), smallBoldFont));
            totalValue.setBorder(Rectangle.TOP);
            totalValue.setPaddingTop(5);
            totalValue.setHorizontalAlignment(Element.ALIGN_RIGHT);

            totalTable.addCell(totalLabel);
            totalTable.addCell(totalValue);

            document.add(totalTable);

            // Footer
            Paragraph footer = new Paragraph(
                    "\n\nThank you for choosing LuxeMart!\nFor any queries, please contact us.", addressFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

        return out.toByteArray();
    }

    private void addTableHeader(PdfPTable table, String headerTitle, Font font, Color bgColor) {
        PdfPCell header = new PdfPCell(new Phrase(headerTitle, font));
        header.setBackgroundColor(bgColor);
        header.setPadding(8);
        header.setHorizontalAlignment(Element.ALIGN_CENTER);
        header.setBorderWidth(1);
        header.setBorderColor(Color.GRAY);
        table.addCell(header);
    }

    private PdfPCell createCell(String content, Font font, int alignment) {
        PdfPCell cell = new PdfPCell(new Phrase(content, font));
        cell.setPadding(6);
        cell.setHorizontalAlignment(alignment);
        cell.setBorderWidth(1);
        cell.setBorderColor(new Color(230, 230, 230)); // Light gray border
        return cell;
    }

    private void addDetailRow(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        PdfPCell c1 = new PdfPCell(new Phrase(label, labelFont));
        c1.setBorder(Rectangle.NO_BORDER);
        table.addCell(c1);

        PdfPCell c2 = new PdfPCell(new Phrase(value, valueFont));
        c2.setBorder(Rectangle.NO_BORDER);
        c2.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(c2);
    }

    private void addTotalRow(PdfPTable table, String label, String value, Font font) {
        PdfPCell cell1 = new PdfPCell(new Phrase(label, font));
        cell1.setBorder(Rectangle.NO_BORDER);
        cell1.setHorizontalAlignment(Element.ALIGN_RIGHT);

        PdfPCell cell2 = new PdfPCell(new Phrase(value, font));
        cell2.setBorder(Rectangle.NO_BORDER);
        cell2.setHorizontalAlignment(Element.ALIGN_RIGHT);

        table.addCell(cell1);
        table.addCell(cell2);
    }
}
