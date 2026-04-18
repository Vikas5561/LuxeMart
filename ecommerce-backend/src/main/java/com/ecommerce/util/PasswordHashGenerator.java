package com.ecommerce.util;

public class PasswordHashGenerator {
    public static void main(String[] args) {
        String password = "admin123";
        String hashedPassword = PasswordUtil.hashPassword(password);
        System.out.println("Hashed password for 'admin123':");
        System.out.println(hashedPassword);

        // Verify it works
        boolean isValid = PasswordUtil.verifyPassword(password, hashedPassword);
        System.out.println("Verification test: " + (isValid ? "PASSED" : "FAILED"));
    }
}
