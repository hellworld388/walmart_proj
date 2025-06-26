const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const db = new Pool({
  user: "postgres",
  host: "localhost",
  database: "supplydb",
  password: "test@123",
  port: 5432,
});

// ✅ Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query(`
      SELECT sm.*, s.supplier_id, s.latitude AS supplier_lat, s.longitude AS supplier_lng, s.sustainability_rating
      FROM store_managers sm
      JOIN suppliers s ON s.manager_id = sm.manager_id
      WHERE sm.email = $1 AND sm.password = $2
    `, [email, password]);

    if (result.rows.length > 0) {
      const row = result.rows[0];
      res.json({
        success: true,
        manager: {
          ...row,
          latitude: row.supplier_lat,
          longitude: row.supplier_lng,
          sustainability_rating: row.sustainability_rating
        }
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Get all products for a supplier, including current sustainability score and thresholds
app.get('/alerts/:supplier_id', async (req, res) => {
  const supplier_id = parseInt(req.params.supplier_id);
  if (isNaN(supplier_id)) {
    return res.status(400).json({ error: 'Invalid supplier ID' });
  }

  try {
    const result = await db.query(`
      SELECT 
        p.product_id, 
        p.name, 
        p.image_url,
        p.price,
        p.current_score, 
        si.current_stock, 
        si.min_threshold
      FROM store_inventory si
      JOIN products p ON p.product_id = si.product_id
      WHERE si.supplier_id = $1
    `, [supplier_id]);
    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});



// ✅ Get suppliers
app.get("/suppliers", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM suppliers");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Get warehouses
app.get("/warehouses", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM warehouses");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Get only warehouses that have stock of a given product
app.get("/warehouses/:product_id", async (req, res) => {
  const product_id = parseInt(req.params.product_id);
  if (isNaN(product_id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  try {
    const result = await db.query(`
      SELECT w.*, wi.current_stock
      FROM warehouses w
      JOIN warehouse_inventory wi ON wi.warehouse_id = w.warehouse_id
      WHERE wi.product_id = $1 AND wi.current_stock > 0
    `, [product_id]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Transport Modes
app.get('/transport-modes', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM transport_modes`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Order placement with sustainability score + stock update
app.post('/order', async (req, res) => {
  const { supplier_id, warehouse_id, product_id, quantity, transport_mode } = req.body;

  if ([supplier_id, warehouse_id, product_id, quantity].some(x => typeof x !== 'number') || typeof transport_mode !== 'string') {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // Insert order
    await client.query(`
      INSERT INTO orders (supplier_id, warehouse_id, product_id, quantity, transport_mode, order_time)
      VALUES ($1, $2, $3, $4, $5, NOW())
    `, [supplier_id, warehouse_id, product_id, quantity, transport_mode]);

    const productRes = await client.query(`
      SELECT recyclability_index, current_score, weight FROM products WHERE product_id = $1
    `, [product_id]);

    const supplierRes = await client.query(`
      SELECT latitude, longitude, sustainability_rating FROM suppliers WHERE supplier_id = $1
    `, [supplier_id]);

    const warehouseRes = await client.query(`
      SELECT latitude, longitude FROM warehouses WHERE warehouse_id = $1
    `, [warehouse_id]);

    const modeRes = await client.query(`
      SELECT sustainability_multiplier FROM transport_modes WHERE mode_type = $1
    `, [transport_mode]);

    if (!productRes.rows.length || !supplierRes.rows.length || !warehouseRes.rows.length || !modeRes.rows.length) {
      throw new Error("Missing product, supplier, warehouse, or transport mode data");
    }

    const { recyclability_index, current_score, weight } = productRes.rows[0];
    const { latitude: sLat, longitude: sLng, sustainability_rating } = supplierRes.rows[0];
    const { latitude: wLat, longitude: wLng } = warehouseRes.rows[0];
    const { sustainability_multiplier } = modeRes.rows[0];

    // Compute distance
    const coordinates = [[sLng, sLat], [wLng, wLat]];
    const orsRes = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      { coordinates },
      {
        headers: {
          Authorization: "5b3ce3597851110001cf6248e9a10a857c964fccb28481078bd6c079",
          "Content-Type": "application/json"
        }
      }
    );

    const summary = orsRes.data.features[0].properties.summary;
    const distance_km = summary.distance / 1000;

    // Compute score
    const base_score = weight * recyclability_index;
    const new_score = (base_score * sustainability_rating) / (distance_km * sustainability_multiplier);
    const updated_score = current_score ? (current_score + new_score) / 2 : new_score;

    // Update score
    await client.query(`UPDATE products SET current_score = $1 WHERE product_id = $2`, [updated_score, product_id]);

    // Update warehouse inventory (decrease)
    await client.query(`
      UPDATE warehouse_inventory
      SET current_stock = current_stock - $1
      WHERE warehouse_id = $2 AND product_id = $3
    `, [quantity, warehouse_id, product_id]);

    // Update supplier inventory (increase)
    const supplierStock = await client.query(`
      SELECT * FROM store_inventory WHERE supplier_id = $1 AND product_id = $2
    `, [supplier_id, product_id]);

    if (supplierStock.rows.length > 0) {
      await client.query(`
        UPDATE store_inventory
        SET current_stock = current_stock + $1
        WHERE supplier_id = $2 AND product_id = $3
      `, [quantity, supplier_id, product_id]);
    } else {
      await client.query(`
        INSERT INTO store_inventory (supplier_id, product_id, current_stock, min_threshold)
        VALUES ($1, $2, $3, 5)
      `, [supplier_id, product_id, quantity]);
    }

    await client.query('COMMIT');

    res.json({
      success: true,
      updated_score: updated_score.toFixed(4),
      route_distance_km: distance_km.toFixed(2),
      used_transport_mode: transport_mode
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error("Order Error:", err.response?.data || err.message);
    res.status(500).json({ error: 'Order failed', detail: err.message });
  } finally {
    client.release();
  }
});

// ✅ Order history
app.get('/order/history/:supplier_id', async (req, res) => {
  const supplier_id = parseInt(req.params.supplier_id);
  if (isNaN(supplier_id)) {
    return res.status(400).json({ error: 'Invalid supplier ID' });
  }

  try {
    const result = await db.query(`
      SELECT * FROM orders WHERE supplier_id = $1 ORDER BY order_time DESC
    `, [supplier_id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Distance API with optional air travel
app.get("/distance/:id1/:id2", async (req, res) => {
  const id1 = parseInt(req.params.id1);
  const id2 = parseInt(req.params.id2);
  const transportMode = req.query.mode;

  if (isNaN(id1) || isNaN(id2) || !transportMode) {
    return res.status(400).json({ error: 'Invalid ID(s) or missing transport mode' });
  }

  const getCoords = async (type, id) => {
    const query = `SELECT latitude, longitude FROM ${type} WHERE ${type === "suppliers" ? "supplier_id" : "warehouse_id"} = $1`;
    const result = await db.query(query, [id]);
    return result.rows[0];
  };

  try {
    const a = await getCoords("suppliers", id1);
    const b = await getCoords("warehouses", id2);
    const tmRes = await db.query(`SELECT * FROM transport_modes WHERE mode_type = $1`, [transportMode]);
    const tm = tmRes.rows[0];

    let distanceKm, durationMin, routeCoords = [];

    if (transportMode === "air") {
      const toRad = deg => deg * (Math.PI / 180);
      const R = 6371;
      const dLat = toRad(b.latitude - a.latitude);
      const dLon = toRad(b.longitude - a.longitude);
      const lat1 = toRad(a.latitude);
      const lat2 = toRad(b.latitude);
      const aFormula = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(aFormula), Math.sqrt(1 - aFormula));
      distanceKm = R * c;
      durationMin = Math.ceil((distanceKm / 800) * 60);
      routeCoords = [[a.latitude, a.longitude], [b.latitude, b.longitude]];
    } else {
      const coordinates = [[a.longitude, a.latitude], [b.longitude, b.latitude]];
      const orsRes = await axios.post(
        "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
        { coordinates },
        {
          headers: {
            Authorization: "5b3ce3597851110001cf6248e9a10a857c964fccb28481078bd6c079",
            "Content-Type": "application/json",
          },
        }
      );
      const summary = orsRes.data.features[0].properties.summary;
      const rawCoords = orsRes.data.features[0].geometry.coordinates;
      routeCoords = rawCoords.map(([lng, lat]) => [lat, lng]);
      distanceKm = summary.distance / 1000;
      durationMin = Math.ceil(summary.duration / 60);
    }

    const estimated_cost = (
      distanceKm * tm.base_cost_per_km * tm.sustainability_multiplier + tm.setup_cost
    ).toFixed(2);

    res.json({
      distance_km: distanceKm.toFixed(2),
      duration_min: durationMin,
      estimated_cost,
      route: routeCoords
    });

  } catch (err) {
    console.error("ORS Error:", err.response?.data || err.message);
    res.status(500).json({ error: "ORS request failed" });
  }
});

// ✅ Start server
app.listen(3000, () => console.log("🚀 Backend running on http://localhost:3000"));
