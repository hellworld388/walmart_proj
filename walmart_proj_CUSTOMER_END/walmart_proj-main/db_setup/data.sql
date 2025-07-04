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


