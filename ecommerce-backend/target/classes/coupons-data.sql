-- Add some sample coupons
INSERT INTO coupons (code, description, discount_percentage, max_discount_amount, min_order_amount, valid_from, valid_until, active, usage_limit, used_count) VALUES
('WELCOME10', 'Welcome offer - 10% off', 10.0, 500.0, 1000.0, CURRENT_TIMESTAMP, DATEADD('DAY', 30, CURRENT_TIMESTAMP), true, 100, 0),
('SAVE20', 'Save 20% on orders above ₹2000', 20.0, 1000.0, 2000.0, CURRENT_TIMESTAMP, DATEADD('DAY', 60, CURRENT_TIMESTAMP), true, 50, 0),
('FLAT500', 'Flat ₹500 off on orders above ₹5000', 10.0, 500.0, 5000.0, CURRENT_TIMESTAMP, DATEADD('DAY', 90, CURRENT_TIMESTAMP), true, 0, 0);
