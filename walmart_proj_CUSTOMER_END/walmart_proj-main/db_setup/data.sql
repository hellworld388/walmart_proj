-- ========================
-- 1. Store Managers
-- ========================
INSERT INTO store_managers (name, email, password) VALUES
('Alice Sharma', 'alice@store.com', 'alice123'),
('Bob Verma', 'bob@store.com', 'bob123'),
('Chetan Roy', 'chetan@store.com', 'chetan123'),
('Divya Singh', 'divya@store.com', 'divya123'),
('Esha Rao', 'esha@store.com', 'esha123'),
('Farhan Khan', 'farhan@store.com', 'farhan123'),
('Gita Joshi', 'gita@store.com', 'gita123'),
('Hari Das', 'hari@store.com', 'hari123'),
('Isha Mehta', 'isha@store.com', 'isha123'),
('Jaya Nair', 'jaya@store.com', 'jaya123')
ON CONFLICT (email) DO NOTHING;

-- ========================
-- 2. Warehouses (Now act as Stores)
-- ========================
INSERT INTO warehouses (name, latitude, longitude, contact, sustainability_rating, manager_id)
SELECT * FROM (
    VALUES
    ('EcoSource A', 12.9716, 77.5946, 'a@eco.com', 5, 1),
    ('GreenTrail B', 17.3850, 78.4867, 'b@green.com', 4, 2),
    ('BioLogix C', 13.0827, 80.2707, 'c@bio.com', 3, 3),
    ('Sustainix D', 19.0760, 72.8777, 'd@sustain.com', 5, 4),
    ('EcoDeliver E', 18.5204, 73.8567, 'e@eco.com', 4, 5),
    ('GoGreen F', 12.2958, 76.6394, 'f@gg.com', 4, 6),
    ('LeafLine G', 28.7041, 77.1025, 'g@leaf.com', 3, 7),
    ('PlanetX H', 22.5726, 88.3639, 'h@planet.com', 2, 8),
    ('Verde I', 20.2961, 85.8245, 'i@verde.com', 4, 9),
    ('EnviroTech J', 22.7196, 75.8577, 'j@enviro.com', 5, 10)
) AS w(name, latitude, longitude, contact, sustainability_rating, manager_id)
WHERE NOT EXISTS (
    SELECT 1 FROM warehouses WHERE warehouses.name = w.name
);

-- ========================
-- 3. Suppliers (Now act as Supply Points)
-- ========================
INSERT INTO suppliers (name, latitude, longitude, manager_id, capacity)
SELECT * FROM (
    VALUES
    ('Central A', 13.0000, 77.5946, 101, 10000),
    ('West B', 18.9300, 72.8777, 102, 8000),
    ('North C', 28.6139, 77.2090, 103, 9000),
    ('East D', 22.5726, 88.3639, 104, 7000),
    ('South E', 13.0827, 80.2707, 105, 8500),
    ('Depot F', 18.5204, 73.8567, 106, 6000),
    ('Hub G', 12.2958, 76.6394, 107, 5500),
    ('Bay H', 20.2961, 85.8245, 108, 5000),
    ('Point I', 22.7196, 75.8577, 109, 4800),
    ('Outpost J', 15.2993, 74.1240, 110, 5200)
) AS s(name, latitude, longitude, manager_id, capacity)
WHERE NOT EXISTS (
    SELECT 1 FROM suppliers WHERE suppliers.name = s.name
);

-- ========================
-- 4. Transport Modes
-- ========================
INSERT INTO transport_modes (mode_type, base_cost_per_km, sustainability_multiplier, setup_cost)
VALUES
('truck', 5.0, 1.2, 1000),
('air', 10.0, 2.0, 5000),
('electric-van', 4.0, 0.3, 2500),
('diesel-truck', 6.0, 1.5, 1500)
ON CONFLICT (mode_type) DO NOTHING;

-- ========================
-- 5. Products
-- ========================
-- Phones
INSERT INTO products (product_id, name, category, image_url, recyclability_index, weight, dimensions, current_score, price) VALUES
(1, 'Samsung Galaxy M14', 'phone', 'https://m.media-amazon.com/images/I/81ZSn2rk9WL._SL1500_.jpg', 0.85, 0.25, '{"length_cm": 16.5, "width_cm": 7.7, "height_cm": 0.9}', 0.0, 12499.0),
(2, 'Realme Narzo N55', 'phone', 'https://m.media-amazon.com/images/I/71d7rfSl0wL._SL1500_.jpg', 0.88, 0.26, '{"length_cm": 16.6, "width_cm": 7.5, "height_cm": 0.8}', 0.0, 10999.0),
(3, 'iPhone 14', 'phone', 'https://m.media-amazon.com/images/I/61bK6PMOC3L._SL1500_.jpg', 0.80, 0.24, '{"length_cm": 14.7, "width_cm": 7.1, "height_cm": 0.7}', 0.0, 69999.0),
(4, 'OnePlus Nord CE 3', 'phone', 'https://m.media-amazon.com/images/I/71AvQd3VzqL._SL1500_.jpg', 0.82, 0.23, '{"length_cm": 16.2, "width_cm": 7.5, "height_cm": 0.8}', 0.0, 24999.0),
(5, 'Poco X5 Pro', 'phone', 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-x5-pro-5g-1.jpg', 0.78, 0.22, '{"length_cm": 16.5, "width_cm": 7.6, "height_cm": 0.8}', 0.0, 18999.0);

-- Salt
INSERT INTO products (product_id, name, category, image_url, recyclability_index, weight, dimensions, current_score, price) VALUES
(6, 'Tata Salt 1kg', 'salt', '/images/tata_salt.jpeg', 0.90, 1.0, '{"length_cm": 12, "width_cm": 5, "height_cm": 18}', 0.0, 30.0),
(7, 'Aashirvaad Salt 1kg', 'salt', '/images/aashirvad_salt.jpeg', 0.92, 1.0, '{"length_cm": 12, "width_cm": 5, "height_cm": 18}', 0.0, 32.0),
(8, 'Catch Salt 1kg', 'salt', '/images/catch_salt.jpeg', 0.88, 1.0, '{"length_cm": 12, "width_cm": 5, "height_cm": 18}', 0.0, 28.0),
(9, 'Annapurna Salt 1kg', 'salt', '/images/annapurna_salt.jpeg', 0.85, 1.0, '{"length_cm": 12, "width_cm": 5, "height_cm": 18}', 0.0, 29.0),
(10, 'Saffola Salt 1kg', 'salt', '/images/saffola_salt.jpeg', 0.80, 1.0, '{"length_cm": 12, "width_cm": 5, "height_cm": 18}', 0.0, 31.0);

-- Soap
INSERT INTO products (product_id, name, category, image_url, recyclability_index, weight, dimensions, current_score, price) VALUES
(11, 'Dove Soap 100g', 'soap', '/images/dove_soap.jpeg', 0.70, 0.1, '{"length_cm": 9, "width_cm": 6, "height_cm": 3}', 0.0, 40.0),
(12, 'Lux Soap 100g', 'soap', '/images/lux_soap.jpeg', 0.68, 0.1, '{"length_cm": 9, "width_cm": 6, "height_cm": 3}', 0.0, 35.0),
(13, 'Pears Soap 100g', 'soap', '/images/download.jpeg', 0.75, 0.1, '{"length_cm": 9, "width_cm": 6, "height_cm": 3}', 0.0, 42.0),
(14, 'Cinthol Soap 100g', 'soap', '/images/cinthol_soap.jpeg', 0.72, 0.1, '{"length_cm": 9, "width_cm": 6, "height_cm": 3}', 0.0, 38.0),
(15, 'Lifebuoy Soap 100g', 'soap', '/images/Lifebuoy_image.jpeg', 0.65, 0.1, '{"length_cm": 9, "width_cm": 6, "height_cm": 3}', 0.0, 33.0);

-- Disinfectant
INSERT INTO products (product_id, name, category, image_url, recyclability_index, weight, dimensions, current_score, price) VALUES
(16, 'Dettol Liquid 500ml', 'disinfectant', '/images/dettol_image.jpeg', 0.74, 0.6, '{"length_cm": 15, "width_cm": 7, "height_cm": 7}', 0.0, 115.0),
(17, 'Savlon Disinfectant 500ml', 'disinfectant', '/images/salvon_image.jpeg', 0.78, 0.6, '{"length_cm": 15, "width_cm": 7, "height_cm": 7}', 0.0, 120.0),
(18, 'Lizol Disinfectant 500ml', 'disinfectant', '/images/Lizol_image.jpeg', 0.80, 0.6, '{"length_cm": 15, "width_cm": 7, "height_cm": 7}', 0.0, 110.0),
(19, 'Harpic Disinfectant 500ml', 'disinfectant', '/images/harpic_image.jpeg', 0.76, 0.6, '{"length_cm": 15, "width_cm": 7, "height_cm": 7}', 0.0, 105.0),
(20, 'Domex Disinfectant 500ml', 'disinfectant', '/images/domex_image.jpeg', 0.82, 0.6, '{"length_cm": 15, "width_cm": 7, "height_cm": 7}', 0.0, 125.0);

-- Baking Ingredients
INSERT INTO products (product_id, name, category, image_url, recyclability_index, weight, dimensions, current_score, price) VALUES
(21, 'Organic Whole Wheat Flour 1kg', 'flour', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.95, 1.0, '{"length_cm": 15, "width_cm": 8, "height_cm": 20}', 0.0, 45.0),
(22, 'All Purpose Flour 1kg', 'flour', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.90, 1.0, '{"length_cm": 15, "width_cm": 8, "height_cm": 20}', 0.0, 35.0),
(23, 'Organic Sugar 500g', 'sugar', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.92, 0.5, '{"length_cm": 12, "width_cm": 6, "height_cm": 15}', 0.0, 25.0),
(24, 'Brown Sugar 500g', 'sugar', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.88, 0.5, '{"length_cm": 12, "width_cm": 6, "height_cm": 15}', 0.0, 30.0),
(25, 'Baking Powder 100g', 'baking', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.85, 0.1, '{"length_cm": 8, "width_cm": 4, "height_cm": 12}', 0.0, 15.0),
(26, 'Baking Soda 100g', 'baking', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.87, 0.1, '{"length_cm": 8, "width_cm": 4, "height_cm": 12}', 0.0, 12.0),
(27, 'Vanilla Extract 30ml', 'extract', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.80, 0.03, '{"length_cm": 6, "width_cm": 3, "height_cm": 8}', 0.0, 85.0),
(28, 'Organic Eggs 12 pieces', 'eggs', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.95, 0.6, '{"length_cm": 20, "width_cm": 15, "height_cm": 8}', 0.0, 60.0),
(29, 'Free Range Eggs 12 pieces', 'eggs', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.90, 0.6, '{"length_cm": 20, "width_cm": 15, "height_cm": 8}', 0.0, 45.0),
(30, 'Organic Milk 1L', 'milk', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.88, 1.0, '{"length_cm": 10, "width_cm": 6, "height_cm": 18}', 0.0, 75.0),
(31, 'Toned Milk 1L', 'milk', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.85, 1.0, '{"length_cm": 10, "width_cm": 6, "height_cm": 18}', 0.0, 55.0),
(32, 'Organic Butter 200g', 'butter', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.82, 0.2, '{"length_cm": 12, "width_cm": 8, "height_cm": 4}', 0.0, 120.0),
(33, 'Regular Butter 200g', 'butter', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.78, 0.2, '{"length_cm": 12, "width_cm": 8, "height_cm": 4}', 0.0, 95.0);

-- Cooking Oils
INSERT INTO products (product_id, name, category, image_url, recyclability_index, weight, dimensions, current_score, price) VALUES
(34, 'Organic Coconut Oil 500ml', 'oil', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.90, 0.5, '{"length_cm": 12, "width_cm": 6, "height_cm": 15}', 0.0, 180.0),
(35, 'Refined Sunflower Oil 1L', 'oil', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.85, 1.0, '{"length_cm": 15, "width_cm": 8, "height_cm": 20}', 0.0, 120.0),
(36, 'Extra Virgin Olive Oil 500ml', 'oil', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.88, 0.5, '{"length_cm": 12, "width_cm": 6, "height_cm": 15}', 0.0, 250.0),
(37, 'Mustard Oil 500ml', 'oil', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.87, 0.5, '{"length_cm": 12, "width_cm": 6, "height_cm": 15}', 0.0, 85.0);

-- Spices and Seasonings
INSERT INTO products (product_id, name, category, image_url, recyclability_index, weight, dimensions, current_score, price) VALUES
(38, 'Organic Black Pepper 50g', 'spice', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.92, 0.05, '{"length_cm": 8, "width_cm": 4, "height_cm": 12}', 0.0, 45.0),
(39, 'Cumin Seeds 100g', 'spice', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.90, 0.1, '{"length_cm": 10, "width_cm": 5, "height_cm": 15}', 0.0, 35.0),
(40, 'Turmeric Powder 100g', 'spice', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.88, 0.1, '{"length_cm": 10, "width_cm": 5, "height_cm": 15}', 0.0, 25.0),
(41, 'Red Chili Powder 100g', 'spice', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.87, 0.1, '{"length_cm": 10, "width_cm": 5, "height_cm": 15}', 0.0, 30.0),
(42, 'Garam Masala 50g', 'spice', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.89, 0.05, '{"length_cm": 8, "width_cm": 4, "height_cm": 12}', 0.0, 40.0),
(43, 'Coriander Powder 100g', 'spice', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.86, 0.1, '{"length_cm": 10, "width_cm": 5, "height_cm": 15}', 0.0, 28.0);

-- Vegetables
INSERT INTO products (product_id, name, category, image_url, recyclability_index, weight, dimensions, current_score, price) VALUES
(44, 'Organic Onions 1kg', 'vegetable', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.98, 1.0, '{"length_cm": 20, "width_cm": 15, "height_cm": 10}', 0.0, 40.0),
(45, 'Fresh Tomatoes 1kg', 'vegetable', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.97, 1.0, '{"length_cm": 20, "width_cm": 15, "height_cm": 10}', 0.0, 35.0),
(46, 'Organic Carrots 500g', 'vegetable', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.96, 0.5, '{"length_cm": 15, "width_cm": 10, "height_cm": 8}', 0.0, 30.0),
(47, 'Fresh Garlic 250g', 'vegetable', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.95, 0.25, '{"length_cm": 12, "width_cm": 8, "height_cm": 6}', 0.0, 25.0),
(48, 'Organic Ginger 200g', 'vegetable', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.94, 0.2, '{"length_cm": 10, "width_cm": 6, "height_cm": 5}', 0.0, 35.0),
(49, 'Fresh Green Chilies 100g', 'vegetable', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.93, 0.1, '{"length_cm": 8, "width_cm": 4, "height_cm": 4}', 0.0, 15.0);

-- Fruits
INSERT INTO products (product_id, name, category, image_url, recyclability_index, weight, dimensions, current_score, price) VALUES
(50, 'Organic Bananas 1kg', 'fruit', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.99, 1.0, '{"length_cm": 25, "width_cm": 15, "height_cm": 8}', 0.0, 45.0),
(51, 'Fresh Apples 1kg', 'fruit', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.98, 1.0, '{"length_cm": 20, "width_cm": 15, "height_cm": 10}', 0.0, 120.0),
(52, 'Organic Oranges 1kg', 'fruit', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.97, 1.0, '{"length_cm": 20, "width_cm": 15, "height_cm": 10}', 0.0, 80.0),
(53, 'Fresh Mangoes 1kg', 'fruit', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.96, 1.0, '{"length_cm": 20, "width_cm": 15, "height_cm": 10}', 0.0, 90.0);

-- Grains and Pulses
INSERT INTO products (product_id, name, category, image_url, recyclability_index, weight, dimensions, current_score, price) VALUES
(54, 'Organic Basmati Rice 1kg', 'rice', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.95, 1.0, '{"length_cm": 15, "width_cm": 8, "height_cm": 20}', 0.0, 85.0),
(55, 'Regular Basmati Rice 1kg', 'rice', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.90, 1.0, '{"length_cm": 15, "width_cm": 8, "height_cm": 20}', 0.0, 65.0),
(56, 'Organic Toor Dal 500g', 'pulse', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.93, 0.5, '{"length_cm": 12, "width_cm": 6, "height_cm": 15}', 0.0, 55.0),
(57, 'Moong Dal 500g', 'pulse', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.91, 0.5, '{"length_cm": 12, "width_cm": 6, "height_cm": 15}', 0.0, 45.0),
(58, 'Organic Chana Dal 500g', 'pulse', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.92, 0.5, '{"length_cm": 12, "width_cm": 6, "height_cm": 15}', 0.0, 50.0);

-- Dairy Products
INSERT INTO products (product_id, name, category, image_url, recyclability_index, weight, dimensions, current_score, price) VALUES
(59, 'Organic Curd 500g', 'dairy', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.85, 0.5, '{"length_cm": 10, "width_cm": 6, "height_cm": 8}', 0.0, 45.0),
(60, 'Paneer 200g', 'dairy', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.80, 0.2, '{"length_cm": 12, "width_cm": 8, "height_cm": 4}', 0.0, 60.0),
(61, 'Organic Cheese 200g', 'dairy', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.78, 0.2, '{"length_cm": 12, "width_cm": 8, "height_cm": 4}', 0.0, 95.0);

-- Beverages
INSERT INTO products (product_id, name, category, image_url, recyclability_index, weight, dimensions, current_score, price) VALUES
(62, 'Organic Green Tea 50 bags', 'tea', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.90, 0.1, '{"length_cm": 15, "width_cm": 8, "height_cm": 12}', 0.0, 120.0),
(63, 'Assam Black Tea 100 bags', 'tea', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.88, 0.2, '{"length_cm": 18, "width_cm": 10, "height_cm": 15}', 0.0, 85.0),
(64, 'Organic Coffee Beans 250g', 'coffee', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.92, 0.25, '{"length_cm": 12, "width_cm": 6, "height_cm": 15}', 0.0, 180.0),
(65, 'Instant Coffee 100g', 'coffee', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.85, 0.1, '{"length_cm": 10, "width_cm": 5, "height_cm": 12}', 0.0, 95.0);

-- Snacks
INSERT INTO products (product_id, name, category, image_url, recyclability_index, weight, dimensions, current_score, price) VALUES
(66, 'Organic Mixed Nuts 200g', 'snacks', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.88, 0.2, '{"length_cm": 12, "width_cm": 6, "height_cm": 15}', 0.0, 150.0),
(67, 'Roasted Almonds 100g', 'snacks', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.90, 0.1, '{"length_cm": 10, "width_cm": 5, "height_cm": 12}', 0.0, 85.0),
(68, 'Organic Popcorn Kernels 500g', 'snacks', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.95, 0.5, '{"length_cm": 15, "width_cm": 8, "height_cm": 20}', 0.0, 65.0);

-- Condiments and Sauces
INSERT INTO products (product_id, name, category, image_url, recyclability_index, weight, dimensions, current_score, price) VALUES
(69, 'Organic Honey 500g', 'condiment', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.92, 0.5, '{"length_cm": 12, "width_cm": 6, "height_cm": 15}', 0.0, 180.0),
(70, 'Tomato Ketchup 500ml', 'sauce', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.85, 0.5, '{"length_cm": 12, "width_cm": 6, "height_cm": 15}', 0.0, 75.0),
(71, 'Soy Sauce 250ml', 'sauce', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.87, 0.25, '{"length_cm": 10, "width_cm": 5, "height_cm": 12}', 0.0, 65.0),
(72, 'Organic Maple Syrup 250ml', 'condiment', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.90, 0.25, '{"length_cm": 10, "width_cm": 5, "height_cm": 12}', 0.0, 220.0);

-- Clothing and Accessories
INSERT INTO products (product_id, name, category, image_url, recyclability_index, weight, dimensions, current_score, price) VALUES
(73, 'Organic Cotton T-Shirt Blue', 'clothing', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.95, 0.2, '{"length_cm": 25, "width_cm": 20, "height_cm": 2}', 0.0, 450.0),
(74, 'Eco-Friendly Jeans Black', 'clothing', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.88, 0.4, '{"length_cm": 30, "width_cm": 25, "height_cm": 3}', 0.0, 850.0),
(75, 'Sustainable Trousers Gray', 'clothing', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.90, 0.35, '{"length_cm": 28, "width_cm": 24, "height_cm": 2}', 0.0, 650.0),
(76, 'Organic Cotton Shirt White', 'clothing', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.92, 0.25, '{"length_cm": 26, "width_cm": 22, "height_cm": 2}', 0.0, 550.0),
(77, 'Recycled Polyester Jacket', 'clothing', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.85, 0.6, '{"length_cm": 32, "width_cm": 28, "height_cm": 4}', 0.0, 1200.0),
(78, 'Bamboo Socks Pack', 'clothing', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.94, 0.1, '{"length_cm": 15, "width_cm": 10, "height_cm": 1}', 0.0, 180.0);

-- Personal Care and Wellness
INSERT INTO products (product_id, name, category, image_url, recyclability_index, weight, dimensions, current_score, price) VALUES
(79, 'Organic Face Cream', 'personal_care', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.88, 0.1, '{"length_cm": 8, "width_cm": 4, "height_cm": 6}', 0.0, 280.0),
(80, 'Natural Shampoo Bar', 'personal_care', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.96, 0.08, '{"length_cm": 6, "width_cm": 4, "height_cm": 2}', 0.0, 120.0),
(81, 'Bamboo Toothbrush', 'personal_care', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.98, 0.05, '{"length_cm": 18, "width_cm": 1, "height_cm": 1}', 0.0, 85.0),
(82, 'Organic Deodorant', 'personal_care', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg', 0.90, 0.08, '{"length_cm": 6, "width_cm": 3, "height_cm": 3}', 0.0, 150.0);

-- ========================
-- 6. Supplier Inventory (Previously warehouse_inventory)
-- ========================
-- Supplier 1: Phones and some salt
INSERT INTO supplier_inventory (supplier_id, product_id, current_stock, min_threshold, max_capacity) VALUES
(1,1,150,20,500),(1,2,120,20,500),(1,3,100,20,500),(1,4,80,20,500),(1,5,60,20,500),
(1,6,90,10,500),(1,7,110,15,500);

-- Supplier 2: Salt and disinfectant
INSERT INTO supplier_inventory (supplier_id, product_id, current_stock, min_threshold, max_capacity) VALUES
(2,6,160,20,500),(2,7,140,20,500),(2,8,120,20,500),(2,9,100,20,500),(2,10,80,20,500),
(2,16,70,10,500),(2,17,60,10,500);

-- Supplier 3: Soap and some phones
INSERT INTO supplier_inventory (supplier_id, product_id, current_stock, min_threshold, max_capacity) VALUES
(3,11,130,20,500),(3,12,110,20,500),(3,13,90,20,500),(3,14,70,20,500),(3,15,50,20,500),
(3,1,95,10,500),(3,2,85,10,500);

-- Supplier 4: Disinfectant and some salt
INSERT INTO supplier_inventory (supplier_id, product_id, current_stock, min_threshold, max_capacity) VALUES
(4,16,120,20,500),(4,17,100,20,500),(4,18,80,20,500),(4,19,60,20,500),(4,20,40,20,500),
(4,6,75,10,500),(4,7,65,10,500);

-- Supplier 5: Phones and salt
INSERT INTO supplier_inventory (supplier_id, product_id, current_stock, min_threshold, max_capacity) VALUES
(5,1,140,20,500),(5,2,120,20,500),(5,3,100,20,500),(5,4,80,20,500),(5,5,60,20,500),
(5,6,55,10,500),(5,7,45,10,500);

-- Supplier 6: Soap and disinfectant
INSERT INTO supplier_inventory (supplier_id, product_id, current_stock, min_threshold, max_capacity) VALUES
(6,11,110,20,500),(6,12,90,20,500),(6,13,70,20,500),(6,14,50,20,500),(6,15,30,20,500),
(6,16,25,10,500),(6,17,20,10,500);

-- Supplier 7: Salt, phones, and some disinfectant
INSERT INTO supplier_inventory (supplier_id, product_id, current_stock, min_threshold, max_capacity) VALUES
(7,6,125,20,500),(7,7,105,20,500),(7,8,85,20,500),(7,9,65,20,500),(7,10,45,20,500),
(7,1,80,10,500),(7,16,60,10,500);

-- Supplier 8: Disinfectant and soap
INSERT INTO supplier_inventory (supplier_id, product_id, current_stock, min_threshold, max_capacity) VALUES
(8,16,115,20,500),(8,17,95,20,500),(8,18,75,20,500),(8,19,55,20,500),(8,20,35,20,500),
(8,11,40,10,500),(8,12,30,10,500);

-- Supplier 9: Phones, salt, and soap
INSERT INTO supplier_inventory (supplier_id, product_id, current_stock, min_threshold, max_capacity) VALUES
(9,1,112,20,500),(9,2,93,20,500),(9,3,74,20,500),(9,6,55,20,500),(9,7,36,20,500),
(9,11,60,10,500),(9,12,50,10,500);

-- Supplier 10: All disinfectant and some salt
INSERT INTO supplier_inventory (supplier_id, product_id, current_stock, min_threshold, max_capacity) VALUES
(10,16,110,20,500),(10,17,90,20,500),(10,18,70,20,500),(10,19,50,20,500),(10,20,30,20,500),
(10,6,25,10,500),(10,7,20,10,500);

-- Add inventory for new products across suppliers
-- Supplier 1: Add baking ingredients
INSERT INTO supplier_inventory (supplier_id, product_id, current_stock, min_threshold, max_capacity) VALUES
(1,21,80,15,500),(1,22,120,20,500),(1,23,90,15,500),(1,24,70,15,500),(1,25,60,10,500),
(1,26,65,10,500),(1,27,40,5,500),(1,28,50,10,500),(1,29,60,10,500);

-- Supplier 2: Add dairy and oils
INSERT INTO supplier_inventory (supplier_id, product_id, current_stock, min_threshold, max_capacity) VALUES
(2,30,85,15,500),(2,31,100,20,500),(2,32,45,10,500),(2,33,55,10,500),(2,34,35,10,500),
(2,35,70,15,500),(2,36,30,5,500),(2,37,40,10,500);

-- Supplier 3: Add spices and vegetables
INSERT INTO supplier_inventory (supplier_id, product_id, current_stock, min_threshold, max_capacity) VALUES
(3,38,50,10,500),(3,39,75,15,500),(3,40,80,15,500),(3,41,70,15,500),(3,42,45,10,500),
(3,43,65,15,500),(3,44,90,20,500),(3,45,85,20,500),(3,46,60,15,500);

-- Supplier 4: Add fruits and grains
INSERT INTO supplier_inventory (supplier_id, product_id, current_stock, min_threshold, max_capacity) VALUES
(4,47,40,10,500),(4,48,35,10,500),(4,49,25,5,500),(4,50,70,15,500),(4,51,45,10,500),
(4,52,55,15,500),(4,53,40,10,500),(4,54,65,15,500),(4,55,80,20,500);

-- Supplier 5: Add pulses and dairy
INSERT INTO supplier_inventory (supplier_id, product_id, current_stock, min_threshold, max_capacity) VALUES
(5,56,50,15,500),(5,57,60,15,500),(5,58,45,10,500),(5,59,70,15,500),(5,60,40,10,500),
(5,61,30,5,500);

-- Supplier 6: Add beverages and snacks
INSERT INTO supplier_inventory (supplier_id, product_id, current_stock, min_threshold, max_capacity) VALUES
(6,62,35,10,500),(6,63,50,15,500),(6,64,25,5,500),(6,65,40,10,500),(6,66,30,5,500),
(6,67,45,10,500),(6,68,55,15,500);

-- Supplier 7: Add condiments and sauces
INSERT INTO supplier_inventory (supplier_id, product_id, current_stock, min_threshold, max_capacity) VALUES
(7,69,25,5,500),(7,70,60,15,500),(7,71,40,10,500),(7,72,20,5,500);

-- Add inventory for clothing and personal care products
-- Supplier 8: Add clothing
INSERT INTO supplier_inventory (supplier_id, product_id, current_stock, min_threshold, max_capacity) VALUES
(8,73,35,10,500),(8,74,25,8,500),(8,75,30,10,500),(8,76,28,8,500),(8,77,20,5,500),(8,78,45,15,500);

-- Supplier 9: Add personal care
INSERT INTO supplier_inventory (supplier_id, product_id, current_stock, min_threshold, max_capacity) VALUES
(9,79,30,10,500),(9,80,40,15,500),(9,81,50,20,500),(9,82,35,10,500);

-- ========================
-- 7. Store Inventory (Previously store_inventory; now warehouse_id based)
-- ========================
-- Warehouse 1: Phones and some soap
INSERT INTO warehouse_inventory (warehouse_id, product_id, current_stock, min_threshold, max_capacity, sustainability_score) VALUES
(1,1,15,5,200,0.85),(1,2,30,10,200,0.88),(1,3,20,10,200,0.80),(1,4,10,5,200,0.82),(1,5,8,3,200,0.78),
(1,11,12,5,200,0.70),(1,12,10,3,200,0.68);

-- Warehouse 2: Salt and disinfectant
INSERT INTO warehouse_inventory (warehouse_id, product_id, current_stock, min_threshold, max_capacity, sustainability_score) VALUES
(2,6,17,5,200,0.90),(2,7,25,10,200,0.92),(2,8,20,10,200,0.88),(2,9,15,5,200,0.85),(2,10,12,4,200,0.80),
(2,16,14,5,200,0.74),(2,17,12,4,200,0.78);

-- Warehouse 3: Soap and some phones
INSERT INTO warehouse_inventory (warehouse_id, product_id, current_stock, min_threshold, max_capacity, sustainability_score) VALUES
(3,11,19,5,200,0.70),(3,12,18,5,200,0.68),(3,13,15,5,200,0.75),(3,14,12,4,200,0.72),(3,15,10,3,200,0.65),
(3,1,8,3,200,0.85),(3,2,7,2,200,0.88);

-- Warehouse 4: Disinfectant and some salt
INSERT INTO warehouse_inventory (warehouse_id, product_id, current_stock, min_threshold, max_capacity, sustainability_score) VALUES
(4,16,20,5,200,0.74),(4,17,18,5,200,0.78),(4,18,15,5,200,0.80),(4,19,12,4,200,0.76),(4,20,10,3,200,0.82),
(4,6,8,3,200,0.90),(4,7,7,2,200,0.92);

-- Warehouse 5: Phones and salt
INSERT INTO warehouse_inventory (warehouse_id, product_id, current_stock, min_threshold, max_capacity, sustainability_score) VALUES
(5,1,16,5,200,0.85),(5,2,14,4,200,0.88),(5,3,12,4,200,0.80),(5,4,10,3,200,0.82),(5,5,8,3,200,0.78),
(5,6,7,2,200,0.90),(5,7,6,2,200,0.92);

-- Warehouse 6: Soap and disinfectant
INSERT INTO warehouse_inventory (warehouse_id, product_id, current_stock, min_threshold, max_capacity, sustainability_score) VALUES
(6,11,15,5,200,0.70),(6,12,13,4,200,0.68),(6,13,11,3,200,0.75),(6,14,9,3,200,0.72),(6,15,7,2,200,0.65),
(6,16,6,2,200,0.74),(6,17,5,2,200,0.78);

-- Warehouse 7: Salt, phones, and some disinfectant
INSERT INTO warehouse_inventory (warehouse_id, product_id, current_stock, min_threshold, max_capacity, sustainability_score) VALUES
(7,6,18,5,200,0.90),(7,7,16,4,200,0.92),(7,8,14,4,200,0.88),(7,9,12,3,200,0.85),(7,10,10,3,200,0.80),
(7,1,8,2,200,0.85),(7,16,6,2,200,0.74);

-- Warehouse 8: Disinfectant and soap
INSERT INTO warehouse_inventory (warehouse_id, product_id, current_stock, min_threshold, max_capacity, sustainability_score) VALUES
(8,16,17,5,200,0.74),(8,17,15,4,200,0.78),(8,18,13,4,200,0.80),(8,19,11,3,200,0.76),(8,20,9,3,200,0.82),
(8,11,7,2,200,0.70),(8,12,6,2,200,0.68);

-- Warehouse 9: Phones, salt, and soap
INSERT INTO warehouse_inventory (warehouse_id, product_id, current_stock, min_threshold, max_capacity, sustainability_score) VALUES
(9,1,14,5,200,0.85),(9,2,12,4,200,0.88),(9,3,10,3,200,0.80),(9,6,8,3,200,0.90),(9,7,7,2,200,0.92),
(9,11,6,2,200,0.70),(9,12,5,2,200,0.68);

-- Warehouse 10: All disinfectant and some salt
INSERT INTO warehouse_inventory (warehouse_id, product_id, current_stock, min_threshold, max_capacity, sustainability_score) VALUES
(10,16,13,5,200,0.74),(10,17,12,4,200,0.78),(10,18,11,3,200,0.80),(10,19,10,3,200,0.76),(10,20,9,2,200,0.82),
(10,6,8,2,200,0.90),(10,7,7,2,200,0.92);

-- Add warehouse inventory for new products
-- Warehouse 1: Add baking ingredients
INSERT INTO warehouse_inventory (warehouse_id, product_id, current_stock, min_threshold, max_capacity, sustainability_score) VALUES
(1,21,8,3,200,0.95),(1,22,12,4,200,0.90),(1,23,9,3,200,0.92),(1,24,7,2,200,0.88),(1,25,6,2,200,0.85),
(1,26,7,2,200,0.87),(1,27,4,1,200,0.80),(1,28,5,2,200,0.95),(1,29,6,2,200,0.90);

-- Warehouse 2: Add dairy and oils
INSERT INTO warehouse_inventory (warehouse_id, product_id, current_stock, min_threshold, max_capacity, sustainability_score) VALUES
(2,30,9,3,200,0.88),(2,31,10,3,200,0.85),(2,32,5,2,200,0.82),(2,33,6,2,200,0.78),(2,34,4,1,200,0.90),
(2,35,7,2,200,0.85),(2,36,3,1,200,0.88),(2,37,4,1,200,0.87);

-- Warehouse 3: Add spices and vegetables
INSERT INTO warehouse_inventory (warehouse_id, product_id, current_stock, min_threshold, max_capacity, sustainability_score) VALUES
(3,38,5,2,200,0.92),(3,39,8,3,200,0.90),(3,40,8,3,200,0.88),(3,41,7,2,200,0.87),(3,42,5,2,200,0.89),
(3,43,7,2,200,0.86),(3,44,9,3,200,0.98),(3,45,9,3,200,0.97),(3,46,6,2,200,0.96);

-- Warehouse 4: Add fruits and grains
INSERT INTO warehouse_inventory (warehouse_id, product_id, current_stock, min_threshold, max_capacity, sustainability_score) VALUES
(4,47,4,1,200,0.95),(4,48,4,1,200,0.94),(4,49,3,1,200,0.93),(4,50,7,2,200,0.99),(4,51,5,2,200,0.98),
(4,52,6,2,200,0.97),(4,53,4,1,200,0.96),(4,54,7,2,200,0.95),(4,55,8,3,200,0.90);

-- Warehouse 5: Add pulses and dairy
INSERT INTO warehouse_inventory (warehouse_id, product_id, current_stock, min_threshold, max_capacity, sustainability_score) VALUES
(5,56,5,2,200,0.93),(5,57,6,2,200,0.91),(5,58,5,2,200,0.92),(5,59,7,2,200,0.85),(5,60,4,1,200,0.80),
(5,61,3,1,200,0.78);

-- Warehouse 6: Add beverages and snacks
INSERT INTO warehouse_inventory (warehouse_id, product_id, current_stock, min_threshold, max_capacity, sustainability_score) VALUES
(6,62,4,1,200,0.90),(6,63,5,2,200,0.88),(6,64,3,1,200,0.92),(6,65,4,1,200,0.85),(6,66,3,1,200,0.88),
(6,67,5,2,200,0.90),(6,68,6,2,200,0.95);

-- Warehouse 7: Add condiments and sauces
INSERT INTO warehouse_inventory (warehouse_id, product_id, current_stock, min_threshold, max_capacity, sustainability_score) VALUES
(7,69,3,1,200,0.92),(7,70,6,2,200,0.85),(7,71,4,1,200,0.87),(7,72,2,1,200,0.90);

-- Warehouse 8: Add more baking ingredients
INSERT INTO warehouse_inventory (warehouse_id, product_id, current_stock, min_threshold, max_capacity, sustainability_score) VALUES
(8,21,6,2,200,0.95),(8,22,8,3,200,0.90),(8,23,7,2,200,0.92),(8,24,5,2,200,0.88),(8,25,5,2,200,0.85),
(8,26,6,2,200,0.87),(8,27,3,1,200,0.80),(8,28,4,1,200,0.95),(8,29,5,2,200,0.90);

-- Warehouse 9: Add more dairy and oils
INSERT INTO warehouse_inventory (warehouse_id, product_id, current_stock, min_threshold, max_capacity, sustainability_score) VALUES
(9,30,7,2,200,0.88),(9,31,8,3,200,0.85),(9,32,4,1,200,0.82),(9,33,5,2,200,0.78),(9,34,3,1,200,0.90),
(9,35,6,2,200,0.85),(9,36,2,1,200,0.88),(9,37,3,1,200,0.87);

-- Warehouse 10: Add more spices and vegetables
INSERT INTO warehouse_inventory (warehouse_id, product_id, current_stock, min_threshold, max_capacity, sustainability_score) VALUES
(10,38,4,1,200,0.92),(10,39,6,2,200,0.90),(10,40,7,2,200,0.88),(10,41,6,2,200,0.87),(10,42,4,1,200,0.89),
(10,43,6,2,200,0.86),(10,44,8,3,200,0.98),(10,45,7,2,200,0.97),(10,46,5,2,200,0.96);

-- Add warehouse inventory for clothing and personal care
-- Warehouse 1: Add clothing
INSERT INTO warehouse_inventory (warehouse_id, product_id, current_stock, min_threshold, max_capacity, sustainability_score) VALUES
(1,73,4,1,200,0.95),(1,74,3,1,200,0.88),(1,75,4,1,200,0.90),(1,76,3,1,200,0.92);

-- Warehouse 2: Add more clothing and personal care
INSERT INTO warehouse_inventory (warehouse_id, product_id, current_stock, min_threshold, max_capacity, sustainability_score) VALUES
(2,77,2,1,200,0.85),(2,78,5,2,200,0.94),(2,79,3,1,200,0.88),(2,80,4,1,200,0.96);

-- Warehouse 3: Add personal care
INSERT INTO warehouse_inventory (warehouse_id, product_id, current_stock, min_threshold, max_capacity, sustainability_score) VALUES
(3,81,5,2,200,0.98),(3,82,3,1,200,0.90);

-- ========================
-- 8. Customer Delivery Modes
-- ========================
INSERT INTO customer_delivery_modes (mode_type, base_cost_per_km, sustainability_index, setup_cost, max_distance) VALUES
('truck', 10, 60, 200, 1000),
('tempo', 8, 70, 100, 200),
('ev', 7, 90, 150, 400),
('drone', 20, 95, 300, 30),
('scooter', 6, 80, 50, 50)
ON CONFLICT (mode_type) DO NOTHING;


