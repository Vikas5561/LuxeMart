package com.ecommerce.controller;

import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.service.ProductService;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class AdminProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Add new product
     */
    @PostMapping("/products")
    public ResponseEntity<?> addProduct(@RequestBody Product product) {
        try {
            // Check if product name already exists
            if (productRepository.existsByProductName(product.getProductName())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Product name already exists");
                return ResponseEntity.badRequest().body(error);
            }

            Product saved = productRepository.save(product);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Update product
     */
    @PutMapping("/products/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        try {
            Product existing = productRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            existing.setProductName(product.getProductName());
            existing.setPrice(product.getPrice());
            existing.setCategory(product.getCategory());
            existing.setDescription(product.getDescription());
            existing.setQuantityAvailable(product.getQuantityAvailable());
            existing.setStatus(product.getStatus());
            existing.setImageUrl(product.getImageUrl());

            Product updated = productRepository.save(existing);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Soft delete product
     */
    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            product.setDeleted(true);
            product.setStatus("Inactive");
            productRepository.save(product);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Product soft deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Restore soft deleted product
     */
    @PostMapping("/products/{id}/restore")
    public ResponseEntity<?> restoreProduct(@PathVariable Long id) {
        try {
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            product.setDeleted(false);
            product.setStatus("Active");
            productRepository.save(product);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Product restored successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Get all products including deleted (for admin)
     */
    @GetMapping("/products/all")
    public ResponseEntity<List<Product>> getAllProductsForAdmin() {
        List<Product> products = productRepository.findAll();
        return ResponseEntity.ok(products);
    }

    /**
     * Search product by ID or name
     */
    @GetMapping("/products/search")
    public ResponseEntity<?> searchProduct(@RequestParam String query) {
        try {
            // Try to parse as ID first
            try {
                Long id = Long.parseLong(query);
                return productRepository.findById(id)
                        .map(ResponseEntity::ok)
                        .orElseThrow(() -> new RuntimeException("Product ID not found"));
            } catch (NumberFormatException e) {
                // Search by name
                List<Product> products = productRepository.findByProductNameContainingIgnoreCase(query);
                if (products.isEmpty()) {
                    throw new RuntimeException("No products matching the name");
                }
                return ResponseEntity.ok(products.get(0)); // Return first match
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @Autowired
    private com.ecommerce.service.BulkUploadService bulkUploadService;

    /**
     * Bulk upload products
     */
    @PostMapping("/products/bulk-upload")
    public ResponseEntity<?> bulkUpload(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Please select a file to upload"));
            }

            int count = 0;
            String fileName = file.getOriginalFilename();

            if (fileName != null && (fileName.endsWith(".csv"))) {
                count = bulkUploadService.saveProductsFromCsv(file);
            } else if (fileName != null && (fileName.endsWith(".xlsx") || fileName.endsWith(".xls"))) {
                count = bulkUploadService.saveProductsFromExcel(file);
            } else {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid file format. Please upload CSV or Excel file."));
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Bulk upload successful");
            response.put("count", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Upload failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Download bulk upload template
     */
    @GetMapping("/products/template")
    public ResponseEntity<?> downloadTemplate() {
        String csvContent = "Product Name,Category,Price,Quantity,Description,Image URL\n" +
                "Sample Product,Electronics,999.99,100,Sample Description,https://example.com/image.jpg";

        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=product_template.csv")
                .header(org.springframework.http.HttpHeaders.CONTENT_TYPE, "text/csv")
                .body(csvContent);
    }

    /**
     * Download products (placeholder)
     */
    @GetMapping("/products/download")
    public ResponseEntity<?> downloadProducts(@RequestParam String format) {
        // TODO: Implement Excel/PDF export of actual products
        Map<String, String> response = new HashMap<>();
        response.put("message", "Download feature coming soon - format: " + format);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all customers
     */
    @GetMapping("/customers")
    public ResponseEntity<List<User>> getAllCustomers() {
        List<User> customers = userRepository.findAll();
        return ResponseEntity.ok(customers);
    }

    /**
     * Download customers (placeholder)
     */
    @GetMapping("/customers/download")
    public ResponseEntity<?> downloadCustomers(@RequestParam String format) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Customer download feature coming soon - format: " + format);
        return ResponseEntity.ok(response);
    }
}
