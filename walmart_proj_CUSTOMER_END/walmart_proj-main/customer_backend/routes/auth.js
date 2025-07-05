const express = require("express");
const router = express.Router();
const db = require("../db");

// Register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO customers (username, password) VALUES ($1, $2) RETURNING id, username",
      [username, password]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Registration error:", err);
    res.status(400).json({ error: "Username already exists" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const result = await db.query(
    "SELECT id, username FROM customers WHERE username=$1 AND password=$2",
    [username, password]
  );
  if (result.rows.length === 0) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  res.json(result.rows[0]);
});

module.exports = router;
