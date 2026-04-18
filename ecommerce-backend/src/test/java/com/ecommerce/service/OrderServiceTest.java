package com.ecommerce.service;

import com.ecommerce.dto.PlaceOrderRequest;
import com.ecommerce.model.*;
import com.ecommerce.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private CartRepository cartRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AddressRepository addressRepository;

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private OrderService orderService;

    private User user;
    private Address address;
    private Cart cart;
    private Product product;
    private PlaceOrderRequest orderRequest;
    private Order order;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setUserId(1L);

        address = new Address();
        address.setAddressId(1L);
        address.setStreet("123 Main St");
        address.setCity("Metropolis");
        address.setState("NY");
        address.setZipCode("10001");
        address.setCountry("USA");
        address.setFullName("John Doe");

        product = new Product();
        product.setProductId(1L);
        product.setProductName("Test Product");
        product.setPrice(100.0);
        product.setStock(10);
        product.setQuantityAvailable(10); // Matches logic in OrderService

        CartItem cartItem = new CartItem();
        cartItem.setProduct(product);
        cartItem.setQuantity(2);
        cartItem.setPrice(100.0);

        cart = new Cart();
        cart.setUser(user);
        cart.setItems(new ArrayList<>(Arrays.asList(cartItem)));
        cart.setTotalPrice(200.0);
        cart.setDiscountAmount(0.0);

        orderRequest = new PlaceOrderRequest();
        orderRequest.setAddressId(1L);
        orderRequest.setPaymentMethod("CREDIT_CARD");

        order = new Order();
        order.setOrderId(1L);
        order.setUser(user);
        order.setStatus("PLACED");
    }

    @Test
    void testPlaceOrder_Success() {
        when(cartRepository.findByUserUserId(1L)).thenReturn(Optional.of(cart));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(addressRepository.findById(1L)).thenReturn(Optional.of(address));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(orderRepository.save(any(Order.class))).thenReturn(order);
        when(paymentRepository.save(any(Payment.class))).thenReturn(new Payment());
        // Mock saving product for stock update
        when(productRepository.save(any(Product.class))).thenReturn(product);
        // Mock saving cart for clearing
        when(cartRepository.save(any(Cart.class))).thenReturn(cart);

        Order placedOrder = orderService.placeOrder(1L, orderRequest);

        assertNotNull(placedOrder);
        verify(orderRepository, times(2)).save(any(Order.class)); // Once initially, once after setting payment status
        verify(paymentRepository, times(1)).save(any(Payment.class));
        verify(productRepository, times(1)).save(product); // Stock update
        verify(cartRepository, times(1)).save(cart); // Clear cart

        assertEquals(8, product.getQuantityAvailable()); // Stock reduced by 2
    }

    @Test
    void testPlaceOrder_EmptyCart() {
        cart.getItems().clear();
        when(cartRepository.findByUserUserId(1L)).thenReturn(Optional.of(cart));

        assertThrows(RuntimeException.class, () -> orderService.placeOrder(1L, orderRequest));
    }

    @Test
    void testCancelOrder_Success() {
        order.setStatus("PLACED");
        order.setUser(user);

        OrderItem item = new OrderItem();
        item.setProduct(product);
        item.setQuantity(2);
        order.setItems(Arrays.asList(item));

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(productRepository.save(any(Product.class))).thenReturn(product);
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        orderService.cancelOrder(1L, 1L);

        assertEquals("CANCELLED", order.getStatus());
        assertEquals(12, product.getQuantityAvailable()); // 10 original + 2 restored
        verify(orderRepository, times(1)).save(order);
    }
}
