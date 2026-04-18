package com.ecommerce.service;

import com.ecommerce.dto.PlaceOrderRequest;
import com.ecommerce.model.*;
import com.ecommerce.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public Order placeOrder(Long userId, PlaceOrderRequest request) {
        // Get user's cart
        Cart cart = cartRepository.findByUserUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Get user and address
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new RuntimeException("Address not found"));

        // Create order
        Order order = new Order();
        order.setUser(user);

        Double discount = cart.getDiscountAmount() != null ? cart.getDiscountAmount() : 0.0;
        Double finalTotal = cart.getTotalPrice() - discount;
        if (finalTotal < 0)
            finalTotal = 0.0;

        order.setTotalAmount(finalTotal);
        order.setDiscountAmount(discount);
        order.setCouponCode(cart.getCouponCode());
        order.setPaymentMethod(request.getPaymentMethod());

        order.setStatus("PLACED");
        order.setPaymentStatus("PENDING");
        order.setShippingAddress(formatAddress(address));
        order.setTrackingNumber(generateTrackingNumber());

        // Create order items from cart items
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cart.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getPrice());
            orderItems.add(orderItem);

            // Update product stock
            Product product = productRepository.findById(cartItem.getProduct().getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            if (product.getQuantityAvailable() < cartItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getProductName());
            }

            int newQuantity = product.getQuantityAvailable() - cartItem.getQuantity();
            product.setQuantityAvailable(newQuantity);
            productRepository.save(product);
        }
        order.setItems(orderItems);

        order = orderRepository.save(order);

        // Create payment
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(order.getTotalAmount());
        payment.setMethod(request.getPaymentMethod());
        payment.setStatus("COMPLETED"); // Simulate successful payment
        payment.setTransactionId("TXN" + System.currentTimeMillis());
        paymentRepository.save(payment);

        // Update order payment status
        order.setPaymentStatus("COMPLETED");
        orderRepository.save(order);

        // Clear cart
        cart.getItems().clear();
        cart.setTotalPrice(0.0);
        cart.setDiscountAmount(0.0);
        cart.setCouponCode(null);
        cartRepository.save(cart);

        return order;
    }

    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserUserIdOrderByOrderDateDesc(userId);
    }

    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(status);

        if (status.equals("DELIVERED")) {
            order.setDeliveryDate(LocalDateTime.now());
        }

        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getRecentOrders() {
        return orderRepository.findTop10ByOrderByOrderDateDesc();
    }

    private String formatAddress(Address address) {
        return String.format("%s, %s, %s, %s, %s - %s",
                address.getStreet(),
                address.getCity(),
                address.getState(),
                address.getCountry(),
                address.getFullName(),
                address.getZipCode());
    }

    private String generateTrackingNumber() {
        return "TRK" + System.currentTimeMillis() + new Random().nextInt(1000);
    }

    public void cancelOrder(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to cancel this order");
        }

        if (!"PLACED".equals(order.getStatus()) && !"CONFIRMED".equals(order.getStatus())) {
            throw new RuntimeException("Order cannot be cancelled in current status: " + order.getStatus());
        }

        order.setStatus("CANCELLED");

        // Restore stock
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setQuantityAvailable(product.getQuantityAvailable() + item.getQuantity());
            productRepository.save(product);
        }

        orderRepository.save(order);
    }
}
