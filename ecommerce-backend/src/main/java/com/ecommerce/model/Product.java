package com.ecommerce.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    @Column(nullable = false, unique = true)
    private String productName; // Unique product name

    @Column(length = 2000)
    private String imageUrl;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false, length = 50)
    private String category; // Fashion, Electronics, Stationary, Home Decor

    @Column(length = 200)
    private String description;

    @Column(nullable = false)
    private Integer quantityAvailable = 0;

    @Column(nullable = false, length = 20)
    private String status = "Active"; // Active or Inactive

    @Column(nullable = false)
    private boolean isDeleted = false; // For soft delete

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // Legacy fields for backward compatibility
    @Deprecated
    private String name;

    @Deprecated
    private Integer stock;

    @Deprecated
    private Double discountPrice;

    @Deprecated
    private Double rating = 0.0;

    @Deprecated
    private Integer reviewCount = 0;

    @Deprecated
    private String brand;

    @Deprecated
    private boolean active = true;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (name == null && productName != null) {
            name = productName;
        }
        if (stock == null && quantityAvailable != null) {
            stock = quantityAvailable;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        if (name == null && productName != null) {
            name = productName;
        }
        if (stock == null && quantityAvailable != null) {
            stock = quantityAvailable;
        }
    }

    public Product() {
    }

    public Product(Long productId, String productName, String imageUrl, Double price, String category,
            String description, Integer quantityAvailable, String status, boolean isDeleted, LocalDateTime createdAt,
            LocalDateTime updatedAt, String name, Integer stock, Double discountPrice, Double rating,
            Integer reviewCount, String brand, boolean active) {
        this.productId = productId;
        this.productName = productName;
        this.imageUrl = imageUrl;
        this.price = price;
        this.category = category;
        this.description = description;
        this.quantityAvailable = quantityAvailable;
        this.status = status;
        this.isDeleted = isDeleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.name = name;
        this.stock = stock;
        this.discountPrice = discountPrice;
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.brand = brand;
        this.active = active;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getQuantityAvailable() {
        return quantityAvailable;
    }

    public void setQuantityAvailable(Integer quantityAvailable) {
        this.quantityAvailable = quantityAvailable;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isDeleted() {
        return isDeleted;
    }

    public void setDeleted(boolean deleted) {
        isDeleted = deleted;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Double getDiscountPrice() {
        return discountPrice;
    }

    public void setDiscountPrice(Double discountPrice) {
        this.discountPrice = discountPrice;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
