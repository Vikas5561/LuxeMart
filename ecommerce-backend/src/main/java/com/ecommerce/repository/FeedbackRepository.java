package com.ecommerce.repository;

import com.ecommerce.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByOrderId(Long orderId);

    List<Feedback> findByCustomerId(String customerId);

    List<Feedback> findByRating(Integer rating);

    List<Feedback> findByOrderIdOrderByCreatedAtDesc(Long orderId);

    List<Feedback> findAllByOrderByCreatedAtDesc();
}
