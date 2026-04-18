package com.ecommerce.controller;

import com.ecommerce.dto.AdminLoginRequest;
import com.ecommerce.dto.AuthResponse;
import com.ecommerce.dto.LoginRequest;
import com.ecommerce.dto.RegisterRequest;
import com.ecommerce.service.AuthService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request, HttpSession session) {
        try {
            AuthResponse response = authService.registerUser(request, session);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpSession session) {
        try {
            AuthResponse response = authService.loginUser(request, session);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @PostMapping("/admin/login")
    public ResponseEntity<?> adminLogin(@RequestBody AdminLoginRequest request, HttpSession session) {
        try {
            AuthResponse response = authService.loginAdmin(request, session);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        authService.logout(session);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logged out successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkAuth(HttpSession session) {
        AuthResponse response = authService.getCurrentUserResponse(session);
        if (response != null) {
            // Backward compatibility for frontend expecting map with isLoggedIn
            Map<String, Object> mapResponse = new HashMap<>();
            mapResponse.put("isLoggedIn", true);
            mapResponse.put("userType", response.getUserType());
            mapResponse.put("userId", response.getUserId());
            mapResponse.put("email", response.getEmail());
            mapResponse.put("firstName", response.getFirstName());
            mapResponse.put("customerId", response.getCustomerId());
            return ResponseEntity.ok(mapResponse);
        }

        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("isLoggedIn", false);
        return ResponseEntity.ok(responseMap);
    }
}
