package com.ecommerce.service;

import com.ecommerce.dto.AddToCartRequest;
import com.ecommerce.model.Cart;
import com.ecommerce.model.CartItem;
import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.CartItemRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@org.springframework.transaction.annotation.Transactional
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public Cart getOrCreateCart(Long userId) {
        System.out.println("getOrCreateCart called for userId: " + userId);
        Optional<Cart> cartOpt = cartRepository.findByUserUserId(userId);

        if (cartOpt.isPresent()) {
            Cart foundCart = cartOpt.get();
            System.out.println(
                    "Found existing cart: " + foundCart.getCartId() + ", Discount: " + foundCart.getDiscountAmount());
            return foundCart;
        }

        System.out.println("Creating NEW cart for userId: " + userId);
        // Create new cart
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = new Cart();
        cart.setUser(user);
        return cartRepository.save(cart);
    }

    public Cart addToCart(Long userId, AddToCartRequest request) {
        Cart cart = getOrCreateCart(userId);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if product already in cart
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getProductId().equals(request.getProductId()))
                .findFirst();

        int existingQuantity = existingItem.map(CartItem::getQuantity).orElse(0);

        if (product.getQuantityAvailable() < (existingQuantity + request.getQuantity())) {
            throw new RuntimeException("Insufficient stock. Only " + product.getQuantityAvailable() + " available.");
        }

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            item.setPrice(product.getDiscountPrice() != null ? product.getDiscountPrice() : product.getPrice());
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(request.getQuantity());
            newItem.setPrice(product.getDiscountPrice() != null ? product.getDiscountPrice() : product.getPrice());
            cart.getItems().add(newItem);
        }

        updateCartTotal(cart);
        return cartRepository.save(cart);
    }

    public Cart updateCartItem(Long userId, Long itemId, Integer quantity) {
        Cart cart = getOrCreateCart(userId);

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getCartItemId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        if (quantity <= 0) {
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            if (item.getProduct().getQuantityAvailable() < quantity) {
                throw new RuntimeException(
                        "Insufficient stock. Only " + item.getProduct().getQuantityAvailable() + " available.");
            }
            item.setQuantity(quantity);
        }

        updateCartTotal(cart);
        return cartRepository.save(cart);
    }

    public Cart removeFromCart(Long userId, Long itemId) {
        Cart cart = getOrCreateCart(userId);

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getCartItemId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        cart.getItems().remove(item);
        cartItemRepository.delete(item);

        updateCartTotal(cart);
        return cartRepository.save(cart);
    }

    public void clearCart(Long userId) {
        Optional<Cart> cartOpt = cartRepository.findByUserUserId(userId);

        if (cartOpt.isPresent()) {
            Cart cart = cartOpt.get();
            cart.getItems().clear();
            cart.setTotalPrice(0.0);
            cartRepository.save(cart);
        }
    }

    private void updateCartTotal(Cart cart) {
        double total = cart.getItems().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
        cart.setTotalPrice(total);
    }

    public void applyCoupon(Long userId, String code, Double discount) {
        Cart cart = getOrCreateCart(userId);
        cart.setCouponCode(code);
        cart.setDiscountAmount(discount);
        cartRepository.saveAndFlush(cart);
    }
}
