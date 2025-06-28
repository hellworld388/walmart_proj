const db = require("../db");
const axios = require("axios");

exports.placeOrder = async (req, res) => {
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

    // Fetch required data
    const productRes = await client.query(`SELECT recyclability_index, current_score, weight FROM products WHERE product_id = $1`, [product_id]);
    const supplierRes = await client.query(`SELECT latitude, longitude FROM suppliers WHERE supplier_id = $1`, [supplier_id]);
    const warehouseRes = await client.query(`SELECT latitude, longitude, sustainability_rating FROM warehouses WHERE warehouse_id = $1`, [warehouse_id]);
    const modeRes = await client.query(`SELECT sustainability_multiplier FROM transport_modes WHERE mode_type = $1`, [transport_mode]);

    if (!productRes.rows.length || !supplierRes.rows.length || !warehouseRes.rows.length || !modeRes.rows.length) {
      throw new Error("Missing product, supplier, warehouse, or transport mode data");
    }

    const { recyclability_index, current_score, weight } = productRes.rows[0];
    const { latitude: sLat, longitude: sLng } = supplierRes.rows[0];
    const { latitude: wLat, longitude: wLng, sustainability_rating } = warehouseRes.rows[0];
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

    // Compute sustainability score
    const base_score = weight * recyclability_index;
    const new_score = (base_score * sustainability_rating) / (distance_km * sustainability_multiplier);
    const updated_score = current_score ? (current_score + new_score) / 2 : new_score;

    // Update product score
    await client.query(`UPDATE products SET current_score = $1 WHERE product_id = $2`, [updated_score, product_id]);

    // Decrease supplier inventory (product is leaving supplier)
    await client.query(`
      UPDATE supplier_inventory
      SET current_stock = current_stock - $1
      WHERE supplier_id = $2 AND product_id = $3
    `, [quantity, supplier_id, product_id]);

    // Increase warehouse/store inventory (product is received at warehouse)
    const warehouseStock = await client.query(`
      SELECT * FROM warehouse_inventory WHERE warehouse_id = $1 AND product_id = $2
    `, [warehouse_id, product_id]);

    if (warehouseStock.rows.length > 0) {
      await client.query(`
        UPDATE warehouse_inventory
        SET current_stock = current_stock + $1
        WHERE warehouse_id = $2 AND product_id = $3
      `, [quantity, warehouse_id, product_id]);
    } else {
      await client.query(`
        INSERT INTO warehouse_inventory (warehouse_id, product_id, current_stock, min_threshold, max_capacity)
        VALUES ($1, $2, $3, 5, 200)
      `, [warehouse_id, product_id, quantity]);
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
};

exports.getOrderHistory = async (req, res) => {
  const warehouse_id = parseInt(req.params.warehouse_id);
  if (isNaN(warehouse_id)) {
    return res.status(400).json({ error: 'Invalid warehouse ID' });
  }

  try {
    const result = await db.query(`
      SELECT * FROM orders WHERE warehouse_id = $1 ORDER BY order_time DESC
    `, [warehouse_id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
