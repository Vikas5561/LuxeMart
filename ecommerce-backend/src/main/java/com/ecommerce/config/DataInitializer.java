package com.ecommerce.config;

import com.ecommerce.model.Admin;
import com.ecommerce.repository.AdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initAdmin(AdminRepository adminRepository) {
        return args -> {

            // Check if admin already exists
            if (adminRepository.findByUsername("admin").isEmpty()) {

                Admin admin = new Admin();
                admin.setUsername("admin");
                admin.setPassword("admin123"); // change later to encrypted
                admin.setEmail("admin@luxemart.com");
                admin.setRole("ADMIN");

                adminRepository.save(admin);

                System.out.println("✅ Admin created successfully!");
            } else {
                System.out.println("ℹ️ Admin already exists");
            }
        };
    }
}