const express = require("express");
const router = express.Router();
const { getDistance } = require("../controllers/distanceController");

router.get("/:id1/:id2", getDistance);

module.exports = router;
