package com.ecommerce.util;

import java.util.regex.Pattern;

/**
 * Utility class for password validation
 */
public class PasswordValidator {

    // Password must be at least 10 characters, contain uppercase, number, and
    // special character
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
            "^(?=.*[0-9])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{10,}$");

    // Phone number must not start with 0 and be 10-15 digits
    private static final Pattern PHONE_PATTERN = Pattern.compile("^[1-9]\\d{9,14}$");

    /**
     * Validates password strength
     * 
     * @param password The password to validate
     * @return true if password meets requirements
     */
    public static boolean isValidPassword(String password) {
        if (password == null || password.isEmpty()) {
            return false;
        }
        return PASSWORD_PATTERN.matcher(password).matches();
    }

    /**
     * Validates phone number format
     * 
     * @param phone The phone number to validate
     * @return true if phone number is valid
     */
    public static boolean isValidPhone(String phone) {
        if (phone == null || phone.isEmpty()) {
            return false;
        }
        return PHONE_PATTERN.matcher(phone).matches();
    }

    /**
     * Get password validation error message
     */
    public static String getPasswordErrorMessage() {
        return "Your password must be at least 10 characters long, containing at least one number, one uppercase letter and one special character";
    }

    /**
     * Get phone validation error message
     */
    public static String getPhoneErrorMessage() {
        return "Phone number should not start with 0";
    }

    /**
     * Validates if passwords match
     */
    public static boolean passwordsMatch(String password, String confirmPassword) {
        return password != null && password.equals(confirmPassword);
    }
}
