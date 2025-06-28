const express = require("express");
const router = express.Router();
const { suggestModes } = require("../controllers/suggestController");

router.post("/suggest-modes", suggestModes);

module.exports = router;
