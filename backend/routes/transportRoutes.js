const express = require("express");
const router = express.Router();
const { getTransportModes } = require("../controllers/transportController");

router.get("/", getTransportModes);

module.exports = router;
