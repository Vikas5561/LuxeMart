package com.ecommerce.service;

import com.ecommerce.dto.DashboardStats;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    public DashboardStats getDashboardStats() {
        DashboardStats stats = new DashboardStats();

        stats.setTotalUsers(userRepository.count());
        stats.setTotalOrders(orderRepository.countTotalOrders());
        stats.setTotalProducts(productRepository.count());

        Double revenue = orderRepository.getTotalRevenue();
        stats.setTotalRevenue(revenue != null ? revenue : 0.0);

        stats.setPendingOrders((long) orderRepository.findByStatus("PLACED").size());
        stats.setShippedOrders((long) orderRepository.findByStatus("SHIPPED").size());
        stats.setDeliveredOrders((long) orderRepository.findByStatus("DELIVERED").size());

        stats.setRecentOrders(orderRepository.findTop5ByOrderByOrderDateDesc());

        return stats;
    }
}
