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
INSERT INTO products (product_id, name, category, image_url, recyclability_index, weight, dimensions, current_score, price) VALUES
(1, 'Samsung Galaxy M14', 'Electronics', 'https://m.media-amazon.com/images/I/81ZSn2rk9WL._SL1500_.jpg', 0.85, 0.25, '{"length_cm": 16.5, "width_cm": 7.7, "height_cm": 0.9}', 0.0, 12499.0),
(2, 'Realme Narzo N55', 'Electronics', 'https://m.media-amazon.com/images/I/71d7rfSl0wL._SL1500_.jpg', 0.88, 0.26, '{"length_cm": 16.6, "width_cm": 7.5, "height_cm": 0.8}', 0.0, 10999.0),
(3, 'Amul Taaza Milk 1L', 'Groceries', 'https://m.media-amazon.com/images/I/81FHt2BMwDL._SL1500_.jpg', 0.95, 1.0, '{"length_cm": 10, "width_cm": 5, "height_cm": 25}', 0.0, 64.0),
(4, 'Tata Salt 1kg', 'Groceries', 'https://m.media-amazon.com/images/I/71fGz8YNLTL._SL1500_.jpg', 0.9, 1.0, '{"length_cm": 12, "width_cm": 5, "height_cm": 18}', 0.0, 30.0),
(5, 'Colgate Toothpaste', 'Personal Care', 'https://m.media-amazon.com/images/I/71lO1wYlC1L._SL1500_.jpg', 0.66, 0.2, '{"length_cm": 18, "width_cm": 4, "height_cm": 4}', 0.0, 55.0),
(6, 'Dove Soap 100g', 'Personal Care', 'https://m.media-amazon.com/images/I/61dz4ItGlLL._SL1500_.jpg', 0.7, 0.1, '{"length_cm": 9, "width_cm": 6, "height_cm": 3}', 0.0, 40.0),
(7, 'Philips LED Bulb', 'Home & Kitchen', 'https://m.media-amazon.com/images/I/61UxfXTUyvL._SL1500_.jpg', 0.9, 0.2, '{"length_cm": 12, "width_cm": 6, "height_cm": 6}', 0.0, 145.0),
(8, 'Lakme Lipstick', 'Beauty', 'https://m.media-amazon.com/images/I/71cwwgBG9iL._SL1500_.jpg', 0.8, 0.05, '{"length_cm": 8, "width_cm": 2, "height_cm": 2}', 0.0, 299.0),
(9, 'Classmate Notebook', 'Stationery', 'https://m.media-amazon.com/images/I/71FWTihCS5L._SL1500_.jpg', 0.78, 0.4, '{"length_cm": 30, "width_cm": 21, "height_cm": 2}', 0.0, 85.0),
(10, 'Dettol Liquid 500ml', 'Health', 'https://m.media-amazon.com/images/I/71j7oRgf-GL._SL1500_.jpg', 0.74, 0.6, '{"length_cm": 15, "width_cm": 7, "height_cm": 7}', 0.0, 115.0)
ON CONFLICT (product_id) DO NOTHING;

-- ========================
-- 6. Supplier Inventory (Previously warehouse_inventory)
-- ========================
-- Only first few shown for brevity, continue similarly...
INSERT INTO supplier_inventory (supplier_id, product_id, current_stock, min_threshold, max_capacity) VALUES
-- Supplier 1
(1,1,150,20,500),(1,2,120,20,500),(1,3,300,25,500),(1,4,250,15,500),(1,5,180,10,500),
(1,6,90,10,500),(1,7,110,15,500),(1,8,75,10,500),(1,9,130,20,500),(1,10,60,10,500),
-- Supplier 2
(2,1,160,20,500),(2,2,140,20,500),(2,3,280,25,500),(2,4,270,15,500),(2,5,150,10,500),
(2,6,80,10,500),(2,7,120,15,500),(2,8,70,10,500),(2,9,110,20,500),(2,10,50,10,500),
-- Supplier 3
(3,1,100,20,500),(3,2,130,20,500),(3,3,260,25,500),(3,4,230,15,500),(3,5,200,10,500),
(3,6,95,10,500),(3,7,100,15,500),(3,8,65,10,500),(3,9,105,20,500),(3,10,40,10,500),
-- Supplier 4
(4,1,120,20,500),(4,2,115,20,500),(4,3,250,25,500),(4,4,220,15,500),(4,5,170,10,500),
(4,6,85,10,500),(4,7,95,15,500),(4,8,60,10,500),(4,9,100,20,500),(4,10,45,10,500),
-- Supplier 5
(5,1,140,20,500),(5,2,125,20,500),(5,3,240,25,500),(5,4,200,15,500),(5,5,160,10,500),
(5,6,75,10,500),(5,7,85,15,500),(5,8,55,10,500),(5,9,95,20,500),(5,10,35,10,500),
-- Supplier 6
(6,1,130,20,500),(6,2,110,20,500),(6,3,220,25,500),(6,4,190,15,500),(6,5,155,10,500),
(6,6,70,10,500),(6,7,90,15,500),(6,8,50,10,500),(6,9,92,20,500),(6,10,30,10,500),
-- Supplier 7
(7,1,125,20,500),(7,2,105,20,500),(7,3,210,25,500),(7,4,180,15,500),(7,5,145,10,500),
(7,6,65,10,500),(7,7,88,15,500),(7,8,52,10,500),(7,9,93,20,500),(7,10,28,10,500),
-- Supplier 8
(8,1,115,20,500),(8,2,95,20,500),(8,3,205,25,500),(8,4,175,15,500),(8,5,140,10,500),
(8,6,62,10,500),(8,7,87,15,500),(8,8,51,10,500),(8,9,90,20,500),(8,10,26,10,500),
-- Supplier 9
(9,1,112,20,500),(9,2,93,20,500),(9,3,198,25,500),(9,4,172,15,500),(9,5,138,10,500),
(9,6,60,10,500),(9,7,84,15,500),(9,8,49,10,500),(9,9,89,20,500),(9,10,25,10,500),
-- Supplier 10
(10,1,110,20,500),(10,2,90,20,500),(10,3,195,25,500),(10,4,170,15,500),(10,5,135,10,500),
(10,6,58,10,500),(10,7,80,15,500),(10,8,45,10,500),(10,9,85,20,500),(10,10,22,10,500);


-- ========================
-- 7. Store Inventory (Previously store_inventory; now warehouse_id based)
-- ========================
INSERT INTO warehouse_inventory (warehouse_id, product_id, current_stock, min_threshold, max_capacity) VALUES
-- Warehouse 1
(1,1,15,5,200),(1,2,30,10,200),(1,3,50,12,200),(1,4,45,10,200),(1,5,33,8,200),
(1,6,12,5,200),(1,7,25,8,200),(1,8,20,5,200),(1,9,30,10,200),(1,10,18,5,200),
-- Warehouse 2
(2,1,17,5,200),(2,2,25,10,200),(2,3,60,12,200),(2,4,40,10,200),(2,5,31,8,200),
(2,6,14,5,200),(2,7,22,8,200),(2,8,18,5,200),(2,9,28,10,200),(2,10,16,5,200),
-- Warehouse 3
(3,1,19,5,200),(3,2,29,10,200),(3,3,58,12,200),(3,4,42,10,200),(3,5,30,8,200),
(3,6,11,5,200),(3,7,24,8,200),(3,8,17,5,200),(3,9,27,10,200),(3,10,15,5,200),
-- Warehouse 4
(4,1,20,5,200),(4,2,27,10,200),(4,3,55,12,200),(4,4,43,10,200),(4,5,29,8,200),
(4,6,13,5,200),(4,7,21,8,200),(4,8,19,5,200),(4,9,25,10,200),(4,10,14,5,200),
-- Warehouse 5
(5,1,18,5,200),(5,2,26,10,200),(5,3,57,12,200),(5,4,41,10,200),(5,5,28,8,200),
(5,6,15,5,200),(5,7,20,8,200),(5,8,16,5,200),(5,9,23,10,200),(5,10,13,5,200),
-- Warehouse 6
(6,1,16,5,200),(6,2,24,10,200),(6,3,54,12,200),(6,4,39,10,200),(6,5,27,8,200),
(6,6,10,5,200),(6,7,19,8,200),(6,8,14,5,200),(6,9,22,10,200),(6,10,12,5,200),
-- Warehouse 7
(7,1,14,5,200),(7,2,22,10,200),(7,3,52,12,200),(7,4,38,10,200),(7,5,26,8,200),
(7,6,9,5,200),(7,7,18,8,200),(7,8,13,5,200),(7,9,21,10,200),(7,10,11,5,200),
-- Warehouse 8
(8,1,13,5,200),(8,2,21,10,200),(8,3,50,12,200),(8,4,36,10,200),(8,5,25,8,200),
(8,6,8,5,200),(8,7,17,8,200),(8,8,12,5,200),(8,9,20,10,200),(8,10,10,5,200),
-- Warehouse 9
(9,1,12,5,200),(9,2,20,10,200),(9,3,48,12,200),(9,4,35,10,200),(9,5,24,8,200),
(9,6,7,5,200),(9,7,16,8,200),(9,8,11,5,200),(9,9,19,10,200),(9,10,9,5,200),
-- Warehouse 10
(10,1,11,5,200),(10,2,18,10,200),(10,3,45,12,200),(10,4,33,10,200),(10,5,23,8,200),
(10,6,6,5,200),(10,7,15,8,200),(10,8,10,5,200),(10,9,18,10,200),(10,10,8,5,200);

