const db = require("../db");

exports.getTransportModes = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM transport_modes");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
