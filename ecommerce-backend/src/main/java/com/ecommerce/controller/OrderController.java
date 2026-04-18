package com.ecommerce.controller;

import com.ecommerce.dto.PlaceOrderRequest;
import com.ecommerce.model.Order;
import com.ecommerce.service.AuthService;
import com.ecommerce.service.OrderService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private AuthService authService;

    @Autowired
    private com.ecommerce.service.InvoiceService invoiceService;

    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody PlaceOrderRequest request, HttpSession session) {
        try {
            if (!authService.isUserLoggedIn(session)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Please login");
            }

            Long userId = authService.getCurrentUserId(session);
            Order order = orderService.placeOrder(userId, request);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping
    public ResponseEntity<?> getUserOrders(HttpSession session) {
        if (!authService.isUserLoggedIn(session)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Please login");
        }

        Long userId = authService.getCurrentUserId(session);
        List<Order> orders = orderService.getUserOrders(userId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id, HttpSession session) {
        try {
            if (!authService.isUserLoggedIn(session)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Please login");
            }

            Order order = orderService.getOrderById(id);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/track")
    public ResponseEntity<?> trackOrder(@PathVariable Long id, HttpSession session) {
        try {
            if (!authService.isUserLoggedIn(session)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Please login");
            }

            Order order = orderService.getOrderById(id);

            Map<String, Object> tracking = new HashMap<>();
            tracking.put("orderId", order.getOrderId());
            tracking.put("status", order.getStatus());
            tracking.put("trackingNumber", order.getTrackingNumber());
            tracking.put("orderDate", order.getOrderDate());
            tracking.put("deliveryDate", order.getDeliveryDate());
            tracking.put("paymentStatus", order.getPaymentStatus());

            return ResponseEntity.ok(tracking);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id, HttpSession session) {
        try {
            if (!authService.isUserLoggedIn(session)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Please login");
            }
            Long userId = authService.getCurrentUserId(session);
            orderService.cancelOrder(id, userId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Order cancelled successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/{id}/invoice")
    public ResponseEntity<?> downloadInvoice(@PathVariable Long id, HttpSession session) {
        try {
            if (!authService.isUserLoggedIn(session)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Please login");
            }

            Order order = orderService.getOrderById(id);
            // Verify ownership
            Long currentUserId = authService.getCurrentUserId(session);
            if (!order.getUser().getUserId().equals(currentUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }

            byte[] pdfBytes = invoiceService.generateInvoice(order);

            if (pdfBytes == null) {
                return ResponseEntity.internalServerError().body("Error generating invoice");
            }

            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=invoice_" + id + ".pdf")
                    .contentType(org.springframework.http.MediaType.APPLICATION_PDF)
                    .body(pdfBytes);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
