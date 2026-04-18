package com.ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/data")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class DataController {

    /**
     * Get list of countries
     */
    @GetMapping("/countries")
    public ResponseEntity<List<String>> getCountries() {
        List<String> countries = Arrays.asList(
                "India",
                "United States",
                "United Kingdom",
                "Canada",
                "Australia",
                "Germany",
                "France",
                "Japan",
                "China",
                "Brazil");
        return ResponseEntity.ok(countries);
    }

    /**
     * Get states based on country
     */
    @GetMapping("/states")
    public ResponseEntity<List<String>> getStates(@RequestParam String country) {
        Map<String, List<String>> statesByCountry = new HashMap<>();

        // India states
        statesByCountry.put("India", Arrays.asList(
                "Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Gujarat",
                "Uttar Pradesh", "West Bengal", "Rajasthan", "Kerala", "Telangana"));

        // USA states
        statesByCountry.put("United States", Arrays.asList(
                "California", "Texas", "Florida", "New York", "Pennsylvania",
                "Illinois", "Ohio", "Georgia", "North Carolina", "Michigan"));

        // UK regions
        statesByCountry.put("United Kingdom", Arrays.asList(
                "England", "Scotland", "Wales", "Northern Ireland"));

        // Canada provinces
        statesByCountry.put("Canada", Arrays.asList(
                "Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba"));

        // Default for other countries
        List<String> states = statesByCountry.getOrDefault(country,
                Collections.singletonList("N/A"));

        return ResponseEntity.ok(states);
    }

    /**
     * Get sample ZIP codes (in real app, this would be a comprehensive database)
     */
    @GetMapping("/zipcodes")
    public ResponseEntity<List<String>> getZipCodes(@RequestParam(required = false) String state) {
        // Sample ZIP codes - in production, use a proper ZIP code database
        List<String> zipCodes = Arrays.asList(
                "110001", "110002", "110003", "110004", "110005",
                "400001", "400002", "400003", "560001", "560002",
                "600001", "600002", "700001", "700002", "500001");
        return ResponseEntity.ok(zipCodes);
    }

    /**
     * Get country codes for phone numbers
     */
    @GetMapping("/country-codes")
    public ResponseEntity<Map<String, String>> getCountryCodes() {
        Map<String, String> countryCodes = new LinkedHashMap<>();
        countryCodes.put("India", "+91");
        countryCodes.put("United States", "+1");
        countryCodes.put("United Kingdom", "+44");
        countryCodes.put("Canada", "+1");
        countryCodes.put("Australia", "+61");
        countryCodes.put("Germany", "+49");
        countryCodes.put("France", "+33");
        countryCodes.put("Japan", "+81");
        countryCodes.put("China", "+86");
        countryCodes.put("Brazil", "+55");
        return ResponseEntity.ok(countryCodes);
    }
}
