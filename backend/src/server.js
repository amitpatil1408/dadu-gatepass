const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const passRoutes = require("./routes/passRoutes");
const authRoutes = require("./routes/authRoutes");
const gateRoutes = require("./routes/gateRoutes");
const app = express();
app.use(cors());


app.use(express.json());

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

// User Routes
app.use("/api/users", userRoutes);
app.use("/api/passes", passRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/gate", gateRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});