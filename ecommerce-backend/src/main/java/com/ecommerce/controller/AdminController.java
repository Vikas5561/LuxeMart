package com.ecommerce.controller;

import com.ecommerce.dto.DashboardStats;
import com.ecommerce.model.Category;
import com.ecommerce.model.Order;
import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.service.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private AuthService authService;

    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    // Dashboard
    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats(HttpSession session) {
        if (!authService.isAdminLoggedIn(session)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Admin access required");
        }

        DashboardStats stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/dashboard/recent-orders")
    public ResponseEntity<?> getRecentOrders(HttpSession session) {
        if (!authService.isAdminLoggedIn(session)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Admin access required");
        }

        List<Order> orders = orderService.getRecentOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/dashboard/top-products")
    public ResponseEntity<?> getTopProducts(HttpSession session) {
        if (!authService.isAdminLoggedIn(session)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Admin access required");
        }

        List<Product> products = productService.getTopRatedProducts();
        return ResponseEntity.ok(products);
    }

    // Product Management - Now handled by AdminProductController
    // All product endpoints moved to AdminProductController

    // Category Management
    @PostMapping("/categories")
    public ResponseEntity<?> addCategory(@RequestBody Category category, HttpSession session) {
        try {
            if (!authService.isAdminLoggedIn(session)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Admin access required");
            }

            Category newCategory = categoryService.addCategory(category);
            return ResponseEntity.ok(newCategory);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody Category category,
            HttpSession session) {
        try {
            if (!authService.isAdminLoggedIn(session)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Admin access required");
            }

            Category updatedCategory = categoryService.updateCategory(id, category);
            return ResponseEntity.ok(updatedCategory);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id, HttpSession session) {
        if (!authService.isAdminLoggedIn(session)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Admin access required");
        }

        categoryService.deleteCategory(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Category deleted successfully");
        return ResponseEntity.ok(response);
    }

    // Order Management - Now handled by AdminOrderController
    // GET /api/admin/orders moved to AdminOrderController

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status,
            HttpSession session) {
        try {
            if (!authService.isAdminLoggedIn(session)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Admin access required");
            }

            Order order = orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    // User Management
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(HttpSession session) {
        if (!authService.isAdminLoggedIn(session)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Admin access required");
        }

        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
}
