package com.ecommerce.service;

import com.ecommerce.dto.AuthResponse;
import com.ecommerce.dto.LoginRequest;
import com.ecommerce.dto.RegisterRequest;
import com.ecommerce.dto.AdminLoginRequest;
import com.ecommerce.model.Admin;
import com.ecommerce.model.User;
import com.ecommerce.repository.AdminRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.util.PasswordUtil;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    public AuthResponse registerUser(RegisterRequest request, HttpSession session) {
        // Validate password confirmation
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Create new user with all fields
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(PasswordUtil.hashPassword(request.getPassword()));
        user.setCountry(request.getCountry());
        user.setState(request.getState());
        user.setCity(request.getCity());
        user.setAddress1(request.getAddress1());
        user.setAddress2(request.getAddress2());
        user.setZipCode(request.getZipCode());
        user.setPhone(request.getPhone());

        user = userRepository.save(user);

        // Store user in session
        session.setAttribute("userId", user.getUserId());
        session.setAttribute("userType", "USER");
        session.setAttribute("customerId", user.getCustomerId());

        return new AuthResponse(
                "Registration successful - Customer ID: " + user.getCustomerId(),
                user.getUserId(),
                user.getEmail(),
                user.getName(),
                "",
                "USER",
                user.getCustomerId());
    }

    public AuthResponse loginUser(LoginRequest request, HttpSession session) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid email or password");
        }

        User user = userOpt.get();

        if (!PasswordUtil.verifyPassword(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        if (!user.isActive()) {
            throw new RuntimeException("Account is disabled");
        }

        // Store user in session
        session.setAttribute("userId", user.getUserId());
        session.setAttribute("userType", "USER");
        session.setAttribute("customerId", user.getCustomerId());

        return new AuthResponse(
                "Login successful",
                user.getUserId(),
                user.getEmail(),
                user.getName(),
                "",
                "USER",
                user.getCustomerId());
    }

    public AuthResponse loginAdmin(AdminLoginRequest request, HttpSession session) {
        Optional<Admin> adminOpt = adminRepository.findByUsername(request.getUsername());

        if (adminOpt.isEmpty()) {
            throw new RuntimeException("Invalid username or password");
        }

        Admin admin = adminOpt.get();

        if (!PasswordUtil.verifyPassword(request.getPassword(), admin.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        // Store admin in session
        session.setAttribute("adminId", admin.getAdminId());
        session.setAttribute("userType", "ADMIN");

        return new AuthResponse(
                "Admin login successful",
                admin.getAdminId(),
                admin.getEmail(),
                admin.getUsername(),
                "",
                "ADMIN",
                null);
    }

    public void logout(HttpSession session) {
        session.invalidate();
    }

    public boolean isUserLoggedIn(HttpSession session) {
        return session.getAttribute("userId") != null;
    }

    public boolean isAdminLoggedIn(HttpSession session) {
        return session.getAttribute("adminId") != null;
    }

    public Long getCurrentUserId(HttpSession session) {
        return (Long) session.getAttribute("userId");
    }

    public Long getCurrentAdminId(HttpSession session) {
        return (Long) session.getAttribute("adminId");
    }

    public AuthResponse getCurrentUserResponse(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId != null) {
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                return new AuthResponse(
                        "Session active",
                        user.getUserId(),
                        user.getEmail(),
                        user.getName(),
                        "",
                        "USER",
                        user.getCustomerId());
            }
        }

        Long adminId = (Long) session.getAttribute("adminId");
        if (adminId != null) {
            Optional<Admin> adminOpt = adminRepository.findById(adminId);
            if (adminOpt.isPresent()) {
                Admin admin = adminOpt.get();
                return new AuthResponse(
                        "Session active",
                        admin.getAdminId(),
                        admin.getEmail(),
                        admin.getUsername(),
                        "",
                        "ADMIN",
                        null);
            }
        }

        return null;
    }
}
