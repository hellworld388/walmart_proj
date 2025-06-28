const db = require("../db");

exports.getAllWarehouses = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM warehouses");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
