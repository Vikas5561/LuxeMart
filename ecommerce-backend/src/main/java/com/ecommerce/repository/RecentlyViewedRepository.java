package com.ecommerce.repository;

import com.ecommerce.model.RecentlyViewed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface RecentlyViewedRepository extends JpaRepository<RecentlyViewed, Long> {
    @Query("SELECT r FROM RecentlyViewed r WHERE r.user.userId = ?1 ORDER BY r.viewedAt DESC")
    List<RecentlyViewed> findByUserUserIdOrderByViewedAtDesc(Long userId);

    @Query("SELECT r FROM RecentlyViewed r WHERE r.user.userId = ?1 AND r.product.productId = ?2")
    RecentlyViewed findByUserUserIdAndProductProductId(Long userId, Long productId);
}
