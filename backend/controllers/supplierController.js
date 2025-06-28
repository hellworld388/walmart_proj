const db = require("../db");

// Get all suppliers
exports.getSuppliers = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM suppliers");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get suppliers with given product in stock
exports.getSuppliersWithProduct = async (req, res) => {
  const product_id = parseInt(req.params.product_id);
  if (isNaN(product_id)) return res.status(400).json({ error: "Invalid product ID" });

  try {
    const result = await db.query(`
      SELECT s.*, si.current_stock
      FROM suppliers s
      JOIN supplier_inventory si ON si.supplier_id = s.supplier_id
      WHERE si.product_id = $1 AND si.current_stock > 0
    `, [product_id]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
