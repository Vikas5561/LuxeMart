package com.ecommerce.controller;

import com.ecommerce.model.Review;
import com.ecommerce.service.AuthService;
import com.ecommerce.service.ReviewService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private AuthService authService;

    @PostMapping
    public ResponseEntity<?> addReview(
            @RequestParam Long productId,
            @RequestParam Integer rating,
            @RequestParam String comment,
            HttpSession session) {
        try {
            if (!authService.isUserLoggedIn(session)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Please login");
            }

            Long userId = authService.getCurrentUserId(session);
            Review review = reviewService.addReview(userId, productId, rating, comment);
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getProductReviews(@PathVariable Long productId) {
        List<Review> reviews = reviewService.getProductReviews(productId);
        return ResponseEntity.ok(reviews);
    }
}
