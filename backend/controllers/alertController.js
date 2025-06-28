const db = require("../db");

exports.getAlerts = async (req, res) => {
  const warehouse_id = parseInt(req.params.warehouse_id);  // Changed from supplier_id
  if (isNaN(warehouse_id)) return res.status(400).json({ error: "Invalid warehouse ID" });

  try {
    const result = await db.query(`
      SELECT 
        p.product_id, p.name, p.image_url, p.price, p.current_score, 
        wi.current_stock, wi.min_threshold
      FROM warehouse_inventory wi
      JOIN products p ON p.product_id = wi.product_id
      WHERE wi.warehouse_id = $1
    `, [warehouse_id]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
