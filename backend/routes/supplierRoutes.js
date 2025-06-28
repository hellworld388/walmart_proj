const express = require("express");
const router = express.Router();
const {
  getSuppliers,
  getSuppliersWithProduct // ✅ Corrected name
} = require("../controllers/supplierController");

router.get("/", getSuppliers);
router.get("/:product_id", getSuppliersWithProduct);

module.exports = router;
