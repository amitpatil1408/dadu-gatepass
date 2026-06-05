const express = require("express");
const pool = require("./config/db");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
     message: "DADU Gatepass API Running",
      database: "Connected",
      time: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      message: "Database connection failed",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});