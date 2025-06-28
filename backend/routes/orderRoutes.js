const express = require("express");
const router = express.Router();
const { placeOrder, getOrderHistory } = require("../controllers/orderController");

router.post("/", placeOrder);
+ router.get("/history/:warehouse_id", getOrderHistory);

module.exports = router;
