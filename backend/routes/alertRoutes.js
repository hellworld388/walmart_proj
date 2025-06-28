// routes/alertRoutes.js
const express = require("express");
const router = express.Router();
const { getAlerts } = require("../controllers/alertController");

// Use warehouse_id because warehouse now acts as STORE
router.get("/:warehouse_id", getAlerts);

module.exports = router;

