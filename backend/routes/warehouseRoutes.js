const express = require("express");
const router = express.Router();
const {
  getAllWarehouses // ✅ corrected name
} = require("../controllers/warehouseController");

router.get("/", getAllWarehouses); // ✅ corrected usage

module.exports = router;
