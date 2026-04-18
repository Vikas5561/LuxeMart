package com.ecommerce.config;

import com.ecommerce.model.Admin;
import com.ecommerce.repository.AdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;

    public DataInitializer(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @Override
    public void run(String... args) {

        if (adminRepository.findByUsername("admin").isEmpty()) {

            Admin admin = new Admin();
            admin.setUsername("admin");
            admin.setPassword("admin123");
            admin.setEmail("admin@luxemart.com");
            admin.setRole("ADMIN");

            adminRepository.save(admin);

            System.out.println("🔥🔥🔥 ADMIN CREATED SUCCESSFULLY 🔥🔥🔥");
        } else {
            System.out.println("ℹ️ Admin already exists");
        }
    }
}