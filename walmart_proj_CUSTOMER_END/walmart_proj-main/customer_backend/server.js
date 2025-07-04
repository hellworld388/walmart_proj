const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const db = require("./db");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/auth", authRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

// Products endpoint
app.get("/products", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        p.product_id, 
        p.name, 
        p.category, 
        p.image_url, 
        p.recyclability_index, 
        p.weight, 
        p.dimensions, 
        p.current_score, 
        p.price,
        COALESCE(SUM(wi.current_stock), 0) AS stock
      FROM products p
      LEFT JOIN warehouse_inventory wi ON p.product_id = wi.product_id
      GROUP BY p.product_id, p.name, p.category, p.image_url, p.recyclability_index, p.weight, p.dimensions, p.current_score, p.price
      ORDER BY p.product_id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Customer backend running at http://localhost:${PORT}`);
});
