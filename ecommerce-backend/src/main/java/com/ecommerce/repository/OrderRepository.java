package com.ecommerce.repository;

import com.ecommerce.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserUserIdOrderByOrderDateDesc(Long userId);

    List<Order> findByStatus(String status);

    List<Order> findTop10ByOrderByOrderDateDesc();

    List<Order> findTop5ByOrderByOrderDateDesc();

    List<Order> findAllByOrderByOrderDateDesc();

    @Query("SELECT COUNT(o) FROM Order o")
    Long countTotalOrders();

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status != 'CANCELLED'")
    Double getTotalRevenue();
}
