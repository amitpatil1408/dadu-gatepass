const pool = require("../config/db");

const getPasses = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM passes");

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch passes",
      error: error.message,
    });
  }
};

const createPass = async (req, res) => {
  try {
    const {
      user_id,
      pass_type_id,
      destination,
      reason,
      out_time,
      expected_in_time,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO passes
      (user_id, pass_type_id, destination, reason, out_time, expected_in_time)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        user_id,
        pass_type_id,
        destination,
        reason,
        out_time,
        expected_in_time,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create pass",
      error: error.message,
    });
  }
};

const approvePass = async (req, res) => {
  try {
    const { id } = req.params;

    const approved_by_user_id = req.user.id;

    const qrToken = `PASS_${id}`;

    const updatedPass = await pool.query(
      `UPDATE passes
       SET status = 'approved',
           approved_by_user_id = $1,
           qr_token = $2
       WHERE id = $3
       RETURNING *`,
      [approved_by_user_id, qrToken, id]
    );

    await pool.query(
      `INSERT INTO approvals
       (pass_id, approved_by_user_id, status, remarks)
       VALUES ($1, $2, 'approved', $3)`,
      [id, approved_by_user_id, "Approved by Superintendent"]
    );

    res.status(200).json({
      message: "Pass approved successfully",
      pass: updatedPass.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to approve pass",
      error: error.message,
    });
  }
};

module.exports = {
  getPasses,
  createPass,
  approvePass,
};