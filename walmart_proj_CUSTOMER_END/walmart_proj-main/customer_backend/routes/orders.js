const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/:customer_id", async (req, res) => {
  const { customer_id } = req.params;
  const result = await db.query(
    `SELECT o.order_id, o.order_date, oi.product_id, p.name, oi.quantity
     FROM customer_orders o
     JOIN customer_order_items oi ON o.order_id = oi.order_id
     JOIN products p ON oi.product_id = p.product_id
     WHERE o.customer_id = $1
     ORDER BY o.order_date DESC`,
    [customer_id]
  );
  res.json(result.rows);
});

module.exports = router;
