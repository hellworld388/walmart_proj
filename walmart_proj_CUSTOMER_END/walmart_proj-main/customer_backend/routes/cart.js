const express = require("express");
const router = express.Router();
const db = require("../db");

// Get cart for a customer
router.get("/:customer_id", async (req, res) => {
  const { customer_id } = req.params;
  const result = await db.query(
    `SELECT c.id, c.product_id, p.name, p.price, p.stock, c.quantity
     FROM cart c JOIN products p ON c.product_id = p.product_id
     WHERE c.customer_id = $1`,
    [customer_id]
  );
  res.json(result.rows);
});

// Add/update item in cart
router.post("/:customer_id", async (req, res) => {
  const { customer_id } = req.params;
  const { product_id, quantity } = req.body;
  console.log("Add to cart:", { customer_id, product_id, quantity });
  try {
    await db.query(
      `INSERT INTO cart (customer_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (customer_id, product_id)
       DO UPDATE SET quantity = cart.quantity + $3`,
      [customer_id, product_id, quantity]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

// Remove item from cart
router.delete("/:customer_id/:product_id", async (req, res) => {
  const { customer_id, product_id } = req.params;
  await db.query("DELETE FROM cart WHERE customer_id=$1 AND product_id=$2", [
    customer_id,
    product_id,
  ]);
  res.json({ success: true });
});

// Checkout (move cart to orders) with delivery vehicle and cost
router.post("/:customer_id/checkout", async (req, res) => {
  const { customer_id } = req.params;
  const { customer_lat, customer_lng } = req.body;

  // Get cart items
  const cartRes = await db.query(
    "SELECT product_id, quantity FROM cart WHERE customer_id=$1",
    [customer_id]
  );

  let totalDeliveryCost = 0;
  let deliveryDetails = [];

  for (const item of cartRes.rows) {
    // Find closest warehouse with stock
    const warehousesRes = await db.query(
      `SELECT w.warehouse_id, w.name, w.latitude, w.longitude, wi.current_stock
       FROM warehouse_inventory wi
       JOIN warehouses w ON wi.warehouse_id = w.warehouse_id
       WHERE wi.product_id = $1 AND wi.current_stock >= $2`,
      [item.product_id, item.quantity]
    );
    if (warehousesRes.rows.length === 0) {
      deliveryDetails.push({
        product_id: item.product_id,
        message: "No warehouse with enough stock",
      });
      continue;
    }
    // Find closest warehouse
    let minDist = Infinity,
      closest = null;
    for (const wh of warehousesRes.rows) {
      const dist = haversine(
        customer_lat,
        customer_lng,
        wh.latitude,
        wh.longitude
      );
      if (dist < minDist) {
        minDist = dist;
        closest = wh;
      }
    }
    // Find best delivery vehicle for this distance
    const modesRes = await db.query(
      `SELECT * FROM customer_delivery_modes WHERE max_distance >= $1`,
      [minDist]
    );
    if (modesRes.rows.length === 0) {
      deliveryDetails.push({
        product_id: item.product_id,
        message: "No delivery vehicle available for this distance",
      });
      continue;
    }
    // Pick the most sustainable
    const best = modesRes.rows.reduce((a, b) =>
      a.sustainability_index > b.sustainability_index ? a : b
    );
    const deliveryCost = best.setup_cost + best.base_cost_per_km * minDist;
    totalDeliveryCost += deliveryCost;

    deliveryDetails.push({
      product_id: item.product_id,
      warehouse: closest.name,
      distance_km: minDist.toFixed(2),
      vehicle: best.mode_type,
      vehicle_sustainability: best.sustainability_index,
      delivery_cost: deliveryCost.toFixed(2),
    });
  }

  // Create order
  const orderRes = await db.query(
    "INSERT INTO customer_orders (customer_id) VALUES ($1) RETURNING order_id",
    [customer_id]
  );
  const order_id = orderRes.rows[0].order_id;

  // Insert order items and update warehouse inventory
  for (const item of cartRes.rows) {
    await db.query(
      "INSERT INTO customer_order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)",
      [order_id, item.product_id, item.quantity]
    );
    // Update warehouse_inventory: decrement stock from the closest warehouse
    const warehousesRes = await db.query(
      `SELECT w.warehouse_id, w.latitude, w.longitude, wi.current_stock
       FROM warehouse_inventory wi
       JOIN warehouses w ON wi.warehouse_id = w.warehouse_id
       WHERE wi.product_id = $1 AND wi.current_stock >= $2`,
      [item.product_id, item.quantity]
    );
    let minDist = Infinity,
      closest = null;
    for (const wh of warehousesRes.rows) {
      const dist = haversine(
        customer_lat,
        customer_lng,
        wh.latitude,
        wh.longitude
      );
      if (dist < minDist) {
        minDist = dist;
        closest = wh;
      }
    }
    if (closest && Number.isFinite(minDist) && minDist > 0) {
      await db.query(
        "UPDATE warehouse_inventory SET current_stock = current_stock - $1 WHERE warehouse_id = $2 AND product_id = $3",
        [item.quantity, closest.warehouse_id, item.product_id]
      );

      // Find best delivery vehicle for this distance (repeat logic)
      const modesRes = await db.query(
        "SELECT * FROM customer_delivery_modes WHERE max_distance >= $1",
        [minDist]
      );
      if (modesRes.rows.length > 0) {
        const best = modesRes.rows.reduce((a, b) =>
          a.sustainability_index > b.sustainability_index ? a : b
        );
        // Get product and warehouse details
        const prodRes = await db.query(
          "SELECT weight, recyclability_index FROM products WHERE product_id = $1",
          [item.product_id]
        );
        const warehouseRes = await db.query(
          "SELECT sustainability_rating FROM warehouses WHERE warehouse_id = $1",
          [closest.warehouse_id]
        );
        const invRes = await db.query(
          "SELECT sustainability_score FROM warehouse_inventory WHERE warehouse_id = $1 AND product_id = $2",
          [closest.warehouse_id, item.product_id]
        );
        const { recyclability_index } = prodRes.rows[0];
        const delivery_sustainability_index = best.sustainability_index;
        let prev_score = 0;
        if (
          invRes.rows.length > 0 &&
          typeof invRes.rows[0].sustainability_score === "number"
        ) {
          prev_score = invRes.rows[0].sustainability_score;
        }
        let sustainability_score = prev_score;
        if (
          delivery_sustainability_index > 0 &&
          Number.isFinite(minDist) &&
          minDist > 0
        ) {
          sustainability_score +=
            (0.00001 * recyclability_index * delivery_sustainability_index) /
            minDist;
        }
        if (sustainability_score !== null) {
          await db.query(
            "UPDATE warehouse_inventory SET sustainability_score = $1 WHERE warehouse_id = $2 AND product_id = $3",
            [sustainability_score, closest.warehouse_id, item.product_id]
          );
        }
      }
    }
  }
  // Clear cart
  await db.query("DELETE FROM cart WHERE customer_id=$1", [customer_id]);
  res.json({
    success: true,
    order_id,
    delivery: deliveryDetails,
    total_delivery_cost: totalDeliveryCost.toFixed(2),
  });
});

// Helper: Haversine formula for distance in km
function haversine(lat1, lon1, lat2, lon2) {
  function toRad(x) {
    return (x * Math.PI) / 180;
  }
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// POST /cart/:customer_id/closest-warehouses
router.post("/:customer_id/closest-warehouses", async (req, res) => {
  const { customer_id } = req.params;
  const { customer_lat, customer_lng } = req.body;

  // Get cart items
  const cartRes = await db.query(
    "SELECT c.product_id, c.quantity, p.name FROM cart c JOIN products p ON c.product_id = p.product_id WHERE c.customer_id=$1",
    [customer_id]
  );

  // For each product, find the closest warehouse with stock
  const results = [];
  for (const item of cartRes.rows) {
    const warehousesRes = await db.query(
      `SELECT w.warehouse_id, w.name, w.latitude, w.longitude, wi.current_stock
       FROM warehouse_inventory wi
       JOIN warehouses w ON wi.warehouse_id = w.warehouse_id
       WHERE wi.product_id = $1 AND wi.current_stock >= $2`,
      [item.product_id, item.quantity]
    );
    if (warehousesRes.rows.length === 0) {
      results.push({
        product_id: item.product_id,
        product_name: item.name,
        warehouse: null,
        message: "No warehouse with enough stock",
      });
      continue;
    }
    // Find closest
    let minDist = Infinity,
      closest = null;
    for (const wh of warehousesRes.rows) {
      const dist = haversine(
        customer_lat,
        customer_lng,
        wh.latitude,
        wh.longitude
      );
      if (dist < minDist) {
        minDist = dist;
        closest = wh;
      }
    }
    results.push({
      product_id: item.product_id,
      product_name: item.name,
      warehouse: {
        name: closest.name,
        distance_km: minDist.toFixed(2),
      },
    });
  }
  res.json(results);
});

// Recommend more sustainable products for each cart item
router.get("/:customer_id/sustainable-recommendations", async (req, res) => {
  const { customer_id } = req.params;
  // Get cart items with category and price
  const cartRes = await db.query(
    `SELECT c.product_id, c.quantity, p.name, p.category, p.recyclability_index, p.price
     FROM cart c JOIN products p ON c.product_id = p.product_id
     WHERE c.customer_id = $1`,
    [customer_id]
  );
  const recommendations = [];
  for (const item of cartRes.rows) {
    // Find the most sustainable product in the same category (not the same product), with stock
    const recRes = await db.query(
      `SELECT p.product_id, p.name, p.price, p.recyclability_index
       FROM products p
       JOIN warehouse_inventory wi ON wi.product_id = p.product_id
       WHERE p.category = $1 AND wi.current_stock > 0
       ORDER BY p.recyclability_index DESC, p.price ASC`,
      [item.category]
    );
    // If the cart item is already the most sustainable, skip recommendation
    if (
      recRes.rows.length > 0 &&
      recRes.rows[0].product_id == item.product_id
    ) {
      continue;
    }
    // Otherwise, recommend the most sustainable (not the same as cart item)
    const priceRange = 0.2; // 20% range
    const bestAlternative = recRes.rows.find(
      (r) =>
        r.product_id != item.product_id &&
        Math.abs(r.price - item.price) / item.price <= priceRange
    );
    if (bestAlternative) {
      recommendations.push({
        cart_product_id: item.product_id,
        cart_product_name: item.name,
        cart_category: item.category,
        cart_recyclability_index: item.recyclability_index,
        cart_product_price: item.price,
        recommended: bestAlternative,
      });
    }
  }
  res.json(recommendations);
});

// Delivery estimate for cart and location (no order placed)
router.post("/:customer_id/delivery-estimate", async (req, res) => {
  const { customer_id } = req.params;
  const { customer_lat, customer_lng } = req.body;

  // Get cart items
  const cartRes = await db.query(
    "SELECT product_id, quantity FROM cart WHERE customer_id=$1",
    [customer_id]
  );

  let totalDeliveryCost = 0;
  let deliveryDetails = [];

  for (const item of cartRes.rows) {
    // Find closest warehouse with stock
    const warehousesRes = await db.query(
      `SELECT w.warehouse_id, w.name, w.latitude, w.longitude, wi.current_stock
       FROM warehouse_inventory wi
       JOIN warehouses w ON wi.warehouse_id = w.warehouse_id
       WHERE wi.product_id = $1 AND wi.current_stock >= $2`,
      [item.product_id, item.quantity]
    );
    if (warehousesRes.rows.length === 0) {
      deliveryDetails.push({
        product_id: item.product_id,
        message: "No warehouse with enough stock",
      });
      continue;
    }
    // Find closest warehouse
    let minDist = Infinity,
      closest = null;
    for (const wh of warehousesRes.rows) {
      const dist = haversine(
        customer_lat,
        customer_lng,
        wh.latitude,
        wh.longitude
      );
      if (dist < minDist) {
        minDist = dist;
        closest = wh;
      }
    }
    // Find best delivery vehicle for this distance
    const modesRes = await db.query(
      `SELECT * FROM customer_delivery_modes WHERE max_distance >= $1`,
      [minDist]
    );
    if (modesRes.rows.length === 0) {
      deliveryDetails.push({
        product_id: item.product_id,
        message: "No delivery vehicle available for this distance",
      });
      continue;
    }
    // Pick the most sustainable
    const best = modesRes.rows.reduce((a, b) =>
      a.sustainability_index > b.sustainability_index ? a : b
    );
    const deliveryCost = best.setup_cost + best.base_cost_per_km * minDist;
    totalDeliveryCost += deliveryCost;

    deliveryDetails.push({
      product_id: item.product_id,
      warehouse: closest.name,
      distance_km: minDist.toFixed(2),
      vehicle: best.mode_type,
      vehicle_sustainability: best.sustainability_index,
      delivery_cost: deliveryCost.toFixed(2),
    });
  }

  res.json({
    delivery: deliveryDetails,
    total_delivery_cost: totalDeliveryCost.toFixed(2),
  });
});

module.exports = router;
