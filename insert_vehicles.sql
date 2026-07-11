-- Insert 10 different vehicles into the dealership_db
INSERT INTO vehicles (id, make, model, category, price, quantity) VALUES
(gen_random_uuid(), 'Tesla', 'Model S', 'Electric', 89990.00, 5),
(gen_random_uuid(), 'Tesla', 'Model 3', 'Electric', 41990.00, 8),
(gen_random_uuid(), 'Ford', 'Mustang Mach-E', 'Electric', 42995.00, 3),
(gen_random_uuid(), 'Porsche', 'Taycan', 'Electric', 90900.00, 2),
(gen_random_uuid(), 'BMW', 'i4 M50', 'Electric', 69700.00, 4),
(gen_random_uuid(), 'Toyota', 'RAV4 Hybrid', 'SUV', 31475.00, 10),
(gen_random_uuid(), 'Ford', 'Explorer', 'SUV', 36760.00, 6),
(gen_random_uuid(), 'BMW', 'X5', 'SUV', 65200.00, 3),
(gen_random_uuid(), 'Honda', 'Civic', 'Sedan', 23950.00, 12),
(gen_random_uuid(), 'Toyota', 'Camry', 'Sedan', 26420.00, 9);
