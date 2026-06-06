const pool = require("../config/db");

const getUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, phone, password_hash, role_id } = req.body;

    const result = await pool.query(
      `INSERT INTO users
      (name, email, phone, password_hash, role_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [name, email, phone, password_hash, role_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create user",
      error: error.message,
    });
  }
};

module.exports = {
  getUsers,
  createUser,
};