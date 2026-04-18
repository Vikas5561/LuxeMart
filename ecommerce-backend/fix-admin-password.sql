-- Fix admin passwords
-- Delete existing admins
DELETE FROM admins;

-- Re-insert with plaintext passwords that will be hashed by the application
-- Note: In production, you would use the PasswordUtil to hash these properly
-- For now, we'll create a simple admin entry that the backend can handle

-- These passwords need to be re-generated using PasswordUtil
-- The hash format is: salt==hashedPassword

-- For password "admin123", using PasswordUtil
INSERT INTO admins (username, email, password, role, created_at) VALUES 
('admin', 'admin@ecommerce.com', '$2a$10$dummyhashthiswillbereplacedbyactualcode', 'ADMIN', CURRENT_TIMESTAMP);
