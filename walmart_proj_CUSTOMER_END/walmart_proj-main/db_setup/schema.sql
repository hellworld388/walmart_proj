-- ========================
-- DROP ALL TABLES FIRST (REORDERED)
-- ========================

DROP TABLE IF EXISTS customer_order_items CASCADE;
DROP TABLE IF EXISTS customer_orders CASCADE;
DROP TABLE IF EXISTS cart CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS supplier_inventory CASCADE;
DROP TABLE IF EXISTS warehouse_inventory CASCADE;

DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS warehouses CASCADE;
DROP TABLE IF EXISTS store_managers CASCADE;

DROP TABLE IF EXISTS products CASCADE;

DROP TABLE IF EXISTS transport_modes CASCADE;
DROP TABLE IF EXISTS customer_delivery_modes CASCADE;


-- =====================
-- 1. STORE MANAGERS
-- ========================
CREATE TABLE IF NOT EXISTS store_managers (
    manager_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

-- ========================
-- 2. WAREHOUSES (now act as STORES)
-- ========================

CREATE TABLE IF NOT EXISTS warehouses (
    warehouse_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    latitude FLOAT,
    longitude FLOAT,
    contact TEXT,
    sustainability_rating INTEGER CHECK (sustainability_rating BETWEEN 1 AND 5),
    manager_id INTEGER REFERENCES store_managers(manager_id) ON DELETE SET NULL
);
-- ========================
-- 3. SUPPLIERS (now act as SUPPLY POINTS)
-- ========================
CREATE TABLE IF NOT EXISTS suppliers (
    supplier_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    latitude FLOAT,
    longitude FLOAT,
    manager_id INTEGER,
    capacity INTEGER
);

-- ========================
-- 4. PRODUCTS
-- ========================
CREATE TABLE IF NOT EXISTS products (
    product_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    recyclability_index FLOAT CHECK (recyclability_index BETWEEN 0 AND 1),
    weight FLOAT,
    dimensions TEXT,
    current_score FLOAT DEFAULT 0,
    price FLOAT CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0
);

-- ========================
-- 5. INVENTORY (Supplier-level inventory; renamed)
-- ========================
CREATE TABLE IF NOT EXISTS supplier_inventory (
    supplier_id INTEGER REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(product_id) ON DELETE CASCADE,
    current_stock INTEGER,
    min_threshold INTEGER,
    max_capacity INTEGER,
    PRIMARY KEY (supplier_id, product_id)
);

-- ========================
-- 6. STORE INVENTORY (Warehouse/store-level; renamed)
-- ========================
CREATE TABLE IF NOT EXISTS warehouse_inventory (
    warehouse_id INTEGER REFERENCES warehouses(warehouse_id),
    product_id INTEGER REFERENCES products(product_id),
    current_stock INTEGER,
    min_threshold INTEGER,
    max_capacity INTEGER,
    sustainability_score FLOAT DEFAULT 0,  -- ✅ New field added
    PRIMARY KEY (warehouse_id, product_id)
);

-- ========================
-- 7. TRANSPORT MODES
-- ========================
CREATE TABLE IF NOT EXISTS transport_modes (
    mode_type TEXT PRIMARY KEY,
    base_cost_per_km FLOAT,
    sustainability_multiplier FLOAT,
    setup_cost FLOAT
);

-- ========================
-- 8. ORDERS
-- ========================
CREATE TABLE IF NOT EXISTS orders (
    order_id SERIAL PRIMARY KEY,
    supplier_id INTEGER REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    warehouse_id INTEGER REFERENCES warehouses(warehouse_id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(product_id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transport_mode TEXT REFERENCES transport_modes(mode_type)
);

CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS cart (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    product_id INTEGER REFERENCES products(product_id),
    quantity INTEGER NOT NULL DEFAULT 1,
    UNIQUE (customer_id, product_id)
);

CREATE TABLE IF NOT EXISTS customer_orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customer_order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES customer_orders(order_id),
    product_id INTEGER REFERENCES products(product_id),
    quantity INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS customer_delivery_modes (
    mode_type TEXT PRIMARY KEY,
    base_cost_per_km FLOAT,
    sustainability_index INTEGER,
    setup_cost FLOAT,
    max_distance FLOAT
);