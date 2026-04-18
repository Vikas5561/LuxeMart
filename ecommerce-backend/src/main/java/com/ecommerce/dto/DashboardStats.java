package com.ecommerce.dto;

public class DashboardStats {
    private Long totalUsers;
    private Long totalOrders;
    private Long totalProducts;
    private Double totalRevenue;
    private Long pendingOrders;
    private Long shippedOrders;
    private Long deliveredOrders;

    public DashboardStats() {
    }

    public DashboardStats(Long totalUsers, Long totalOrders, Long totalProducts, Double totalRevenue,
            Long pendingOrders, Long shippedOrders, Long deliveredOrders) {
        this.totalUsers = totalUsers;
        this.totalOrders = totalOrders;
        this.totalProducts = totalProducts;
        this.totalRevenue = totalRevenue;
        this.pendingOrders = pendingOrders;
        this.shippedOrders = shippedOrders;
        this.deliveredOrders = deliveredOrders;
    }

    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(Long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public Long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(Long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public Double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(Double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public Long getPendingOrders() {
        return pendingOrders;
    }

    public void setPendingOrders(Long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public Long getShippedOrders() {
        return shippedOrders;
    }

    public void setShippedOrders(Long shippedOrders) {
        this.shippedOrders = shippedOrders;
    }

    public Long getDeliveredOrders() {
        return deliveredOrders;
    }

    public void setDeliveredOrders(Long deliveredOrders) {
        this.deliveredOrders = deliveredOrders;
    }

    public java.util.List<com.ecommerce.model.Order> getRecentOrders() {
        return recentOrders;
    }

    public void setRecentOrders(java.util.List<com.ecommerce.model.Order> recentOrders) {
        this.recentOrders = recentOrders;
    }

    private java.util.List<com.ecommerce.model.Order> recentOrders;
}
