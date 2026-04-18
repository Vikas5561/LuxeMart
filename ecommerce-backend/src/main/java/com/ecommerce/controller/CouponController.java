package com.ecommerce.controller;

import com.ecommerce.model.Coupon;
import com.ecommerce.service.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class CouponController {

    @Autowired
    private CouponService couponService;

    @Autowired
    private com.ecommerce.service.AuthService authService;

    @Autowired
    private com.ecommerce.service.CartService cartService;

    @GetMapping("/active")
    public ResponseEntity<List<Coupon>> getActiveCoupons() {
        return ResponseEntity.ok(couponService.getAllActiveCoupons());
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateCoupon(@RequestParam String code, @RequestParam Double orderAmount,
            jakarta.servlet.http.HttpSession session) {
        try {
            Map<String, Object> result = couponService.validateAndApplyCoupon(code, orderAmount);

            if (Boolean.TRUE.equals(result.get("valid"))) {
                if (authService.isUserLoggedIn(session)) {
                    Long userId = authService.getCurrentUserId(session);
                    Double discount = ((Number) result.get("discount")).doubleValue();
                    cartService.applyCoupon(userId, code, discount);
                }
            }

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("valid", false, "message", e.getMessage()));
        }
    }

    // Admin endpoints
    @PostMapping("/admin/create")
    public ResponseEntity<?> createCoupon(@RequestBody Coupon coupon) {
        Coupon created = couponService.createCoupon(coupon);
        return ResponseEntity.ok(Map.of("message", "Coupon created", "coupon", created));
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<?> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.ok(Map.of("message", "Coupon deleted"));
    }
}
