package com.ecommerce.service;

import com.ecommerce.model.Coupon;
import com.ecommerce.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class CouponService {
    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private com.ecommerce.repository.OfferRepository offerRepository;

    public List<Coupon> getAllActiveCoupons() {
        return couponRepository.findByActive(true);
    }

    public Map<String, Object> validateAndApplyCoupon(String code, Double orderAmount) {
        Map<String, Object> result = new HashMap<>();

        // First try to find a Coupon
        return couponRepository.findByCode(code)
                .map(coupon -> validateCouponEntity(coupon, orderAmount))
                .orElseGet(() ->
                // If no Coupon found, try to find an Offer
                offerRepository.findByDiscountCode(code)
                        .map(offer -> validateOfferEntity(offer, orderAmount))
                        .orElseGet(() -> {
                            result.put("valid", false);
                            result.put("message", "Invalid coupon code");
                            return result;
                        }));
    }

    private Map<String, Object> validateCouponEntity(Coupon coupon, Double orderAmount) {
        Map<String, Object> result = new HashMap<>();

        if (!coupon.getActive()) {
            return errorResponse("Coupon is not active");
        }

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(coupon.getValidFrom()) || now.isAfter(coupon.getValidUntil())) {
            return errorResponse("Coupon has expired");
        }

        if (coupon.getMinOrderAmount() != null && orderAmount < coupon.getMinOrderAmount()) {
            return errorResponse("Minimum order amount: ₹" + coupon.getMinOrderAmount());
        }

        if (coupon.getUsageLimit() > 0 && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            return errorResponse("Coupon usage limit reached");
        }

        // Calculate discount
        Double discount = (orderAmount * coupon.getDiscountPercentage()) / 100;
        if (coupon.getMaxDiscountAmount() != null && discount > coupon.getMaxDiscountAmount()) {
            discount = coupon.getMaxDiscountAmount();
        }

        // Increment usage count
        coupon.setUsedCount(coupon.getUsedCount() + 1);
        couponRepository.save(coupon);

        return successResponse(discount, orderAmount);
    }

    private Map<String, Object> validateOfferEntity(com.ecommerce.model.Offer offer, Double orderAmount) {
        if (!"Active".equalsIgnoreCase(offer.getStatus())) {
            return errorResponse("Offer is not active");
        }

        if (offer.getValidUntil() != null && LocalDateTime.now().isAfter(offer.getValidUntil())) {
            return errorResponse("Offer has expired");
        }

        Double discount = (orderAmount * offer.getDiscountPercentage()) / 100;
        return successResponse(discount, orderAmount);
    }

    private Map<String, Object> errorResponse(String message) {
        Map<String, Object> result = new HashMap<>();
        result.put("valid", false);
        result.put("message", message);
        return result;
    }

    private Map<String, Object> successResponse(Double discount, Double orderAmount) {
        Map<String, Object> result = new HashMap<>();
        result.put("valid", true);
        result.put("discount", discount);
        result.put("finalAmount", orderAmount - discount);
        result.put("message", "Coupon applied successfully!");
        return result;
    }

    public Coupon createCoupon(Coupon coupon) {
        return couponRepository.save(coupon);
    }

    public void deleteCoupon(Long couponId) {
        couponRepository.deleteById(couponId);
    }
}
