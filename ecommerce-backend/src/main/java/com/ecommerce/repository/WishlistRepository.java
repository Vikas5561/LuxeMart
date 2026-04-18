package com.ecommerce.repository;

import com.ecommerce.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUserUserId(Long userId);

    Optional<Wishlist> findByUserUserIdAndProductProductId(Long userId, Long productId);

    @Query("SELECT w FROM Wishlist w WHERE w.user.userId = ?1 ORDER BY w.addedAt DESC")
    List<Wishlist> findByUserUserIdOrderByAddedAtDesc(Long userId);

    void deleteByUserUserIdAndProductProductId(Long userId, Long productId);
}
