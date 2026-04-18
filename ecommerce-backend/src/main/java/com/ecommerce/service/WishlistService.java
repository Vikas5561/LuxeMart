package com.ecommerce.service;

import com.ecommerce.model.Wishlist;
import com.ecommerce.model.User;
import com.ecommerce.model.Product;
import com.ecommerce.repository.WishlistRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WishlistService {
    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Wishlist> getUserWishlist(Long userId) {
        return wishlistRepository.findByUserUserIdOrderByAddedAtDesc(userId);
    }

    @Transactional
    public Wishlist addToWishlist(Long userId, Long productId) {
        // Check if already in wishlist
        var existing = wishlistRepository.findByUserUserIdAndProductProductId(userId, productId);
        if (existing.isPresent()) {
            return existing.get();
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setProduct(product);

        return wishlistRepository.save(wishlist);
    }

    @Transactional
    public void removeFromWishlist(Long userId, Long productId) {
        wishlistRepository.deleteByUserUserIdAndProductProductId(userId, productId);
    }

    public boolean isInWishlist(Long userId, Long productId) {
        return wishlistRepository.findByUserUserIdAndProductProductId(userId, productId).isPresent();
    }
}
