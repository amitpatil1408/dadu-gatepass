const pool = require("../config/db");

const scanPass = async (req, res) => {
  try {
    const { qr_token, action, scanned_by_user_id } = req.body;

    const passResult = await pool.query(
      "SELECT * FROM passes WHERE qr_token = $1",
      [qr_token]
    );

    if (passResult.rows.length === 0) {
      return res.status(404).json({
        message: "Pass not found",
      });
    }

    const pass = passResult.rows[0];

    if (pass.status !== "approved") {
      return res.status(400).json({
        message: "Pass is not approved",
      });
    }

    const logResult = await pool.query(
      `INSERT INTO gate_logs
       (pass_id, action, scanned_by_user_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [pass.id, action, scanned_by_user_id]
    );

    res.status(201).json({
      message: "Gate scan successful",
      log: logResult.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Gate scan failed",
      error: error.message,
    });
  }
};

const getGateLogs = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM gate_logs
       ORDER BY created_at DESC`
    );

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch gate logs",
      error: error.message,
    });
  }
};

module.exports = {
  scanPass,
  getGateLogs,
};