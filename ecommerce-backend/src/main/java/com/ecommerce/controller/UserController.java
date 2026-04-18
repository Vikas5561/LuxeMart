package com.ecommerce.controller;

import com.ecommerce.model.Address;
import com.ecommerce.model.User;
import com.ecommerce.service.AuthService;
import com.ecommerce.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(HttpSession session) {
        if (!authService.isUserLoggedIn(session)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Please login");
        }

        Long userId = authService.getCurrentUserId(session);
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody User user, HttpSession session) {
        try {
            if (!authService.isUserLoggedIn(session)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Please login");
            }

            Long userId = authService.getCurrentUserId(session);
            User updatedUser = userService.updateUser(userId, user);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/addresses")
    public ResponseEntity<?> getAddresses(HttpSession session) {
        if (!authService.isUserLoggedIn(session)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Please login");
        }

        Long userId = authService.getCurrentUserId(session);
        List<Address> addresses = userService.getUserAddresses(userId);
        return ResponseEntity.ok(addresses);
    }

    @PostMapping("/addresses")
    public ResponseEntity<?> addAddress(@RequestBody Address address, HttpSession session) {
        try {
            if (!authService.isUserLoggedIn(session)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Please login");
            }

            Long userId = authService.getCurrentUserId(session);
            Address newAddress = userService.addAddress(userId, address);
            return ResponseEntity.ok(newAddress);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PutMapping("/addresses/{id}")
    public ResponseEntity<?> updateAddress(@PathVariable Long id, @RequestBody Address address, HttpSession session) {
        try {
            if (!authService.isUserLoggedIn(session)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Please login");
            }

            Address updatedAddress = userService.updateAddress(id, address);
            return ResponseEntity.ok(updatedAddress);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @DeleteMapping("/addresses/{id}")
    public ResponseEntity<?> deleteAddress(@PathVariable Long id, HttpSession session) {
        if (!authService.isUserLoggedIn(session)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Please login");
        }

        userService.deleteAddress(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Address deleted successfully");
        return ResponseEntity.ok(response);
    }
}
