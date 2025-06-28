const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const customDb = require('./db'); // 🔁 renamed to avoid conflict

const { Pool } = require("pg");
const db = new Pool({
  user: "postgres",
  host: "localhost",
  database: "supplydb",
  password: "test@123",
  port: 5432,
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Attach db (main one) to app.locals
app.locals.db = db;

// ✅ Import route files
const loginRoutes = require("./routes/loginRoutes");
const alertRoutes = require("./routes/alertRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const warehouseRoutes = require("./routes/warehouseRoutes");
const transportRoutes = require("./routes/transportRoutes");
const orderRoutes = require("./routes/orderRoutes");
const distanceRoutes = require("./routes/distanceRoutes");
const suggestRoutes = require("./routes/suggestRoutes");


// ✅ Use routes
app.use("/login", loginRoutes);
app.use("/alerts", alertRoutes);
app.use("/suppliers", supplierRoutes);
app.use("/warehouses", warehouseRoutes);
app.use("/transport-modes", transportRoutes);
app.use("/order", orderRoutes);
app.use("/distance", distanceRoutes);
app.use("/suggest", suggestRoutes);


// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
