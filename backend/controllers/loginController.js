const db = require("../db");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query(`
      SELECT sm.*, w.warehouse_id, w.latitude AS warehouse_lat, w.longitude AS warehouse_lng, w.sustainability_rating
      FROM store_managers sm
      JOIN warehouses w ON w.manager_id = sm.manager_id
      WHERE sm.email = $1 AND sm.password = $2
    `, [email, password]);

    if (result.rows.length > 0) {
      const row = result.rows[0];
      res.json({
        success: true,
        manager: {
          ...row,
          warehouse_id: row.warehouse_id,
          latitude: row.warehouse_lat,
          longitude: row.warehouse_lng,
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
};
