package com.ecommerce.repository;

import com.ecommerce.model.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OfferRepository extends JpaRepository<Offer, Long> {
    List<Offer> findByStatus(String status);

    java.util.Optional<Offer> findByDiscountCode(String discountCode);
}
