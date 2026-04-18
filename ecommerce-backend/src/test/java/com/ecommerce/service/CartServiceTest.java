package com.ecommerce.service;

import com.ecommerce.dto.AddToCartRequest;
import com.ecommerce.model.Cart;
import com.ecommerce.model.CartItem;
import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private com.ecommerce.repository.CartItemRepository cartItemRepository;

    @InjectMocks
    private CartService cartService;

    private User user;
    private Product product;
    private Cart cart;
    private AddToCartRequest request;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setUserId(1L);

        product = new Product();
        product.setProductId(1L);
        product.setProductName("Test Product");
        product.setPrice(100.0);
        product.setStock(10);
        product.setQuantityAvailable(10); // Fix: Set available quantity

        cart = new Cart();
        cart.setUser(user);
        cart.setItems(new ArrayList<>());
        cart.setTotalPrice(0.0);

        request = new AddToCartRequest();
        request.setProductId(1L);
        request.setQuantity(2);
    }

    @Test
    void testAddToCart_NewItem() {
        when(cartRepository.findByUserUserId(1L)).thenReturn(Optional.of(cart));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(cartRepository.save(any(Cart.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Cart updatedCart = cartService.addToCart(1L, request);

        assertNotNull(updatedCart);
        assertEquals(1, updatedCart.getItems().size());
        assertEquals(200.0, updatedCart.getTotalPrice());
        assertEquals(2, updatedCart.getItems().get(0).getQuantity());
        verify(cartRepository, times(1)).save(cart);
    }

    @Test
    void testAddToCart_ExistingItem() {
        CartItem existingItem = new CartItem();
        existingItem.setProduct(product);
        existingItem.setQuantity(1);
        existingItem.setPrice(100.0);

        cart.getItems().add(existingItem);
        cart.setTotalPrice(100.0);

        when(cartRepository.findByUserUserId(1L)).thenReturn(Optional.of(cart));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(cartRepository.save(any(Cart.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Cart updatedCart = cartService.addToCart(1L, request);

        assertEquals(1, updatedCart.getItems().size());
        assertEquals(300.0, updatedCart.getTotalPrice()); // 100 + 200
        assertEquals(3, updatedCart.getItems().get(0).getQuantity()); // 1 + 2
    }

    @Test
    void testRemoveFromCart() {
        CartItem itemToRemove = new CartItem();
        itemToRemove.setCartItemId(1L);
        itemToRemove.setProduct(product);
        itemToRemove.setQuantity(1);
        itemToRemove.setPrice(100.0);

        cart.getItems().add(itemToRemove);
        cart.setTotalPrice(100.0);

        when(cartRepository.findByUserUserId(1L)).thenReturn(Optional.of(cart));
        when(cartRepository.save(any(Cart.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Cart updatedCart = cartService.removeFromCart(1L, 1L);

        assertTrue(updatedCart.getItems().isEmpty());
        assertEquals(0.0, updatedCart.getTotalPrice());
    }
}
