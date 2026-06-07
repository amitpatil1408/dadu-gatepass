const express = require("express");
const router = express.Router();

const {
  getPasses,
  createPass,
  approvePass,
  rejectPass,
} = require("../controllers/passController");

const { verifyToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.get("/", getPasses);

router.post("/", createPass);

router.put(
  "/:id/approve",
  verifyToken,
  authorizeRoles(4, 5),
  approvePass
);

router.put(
  "/:id/reject",
  verifyToken,
  authorizeRoles(4, 5),
  rejectPass
);

module.exports = router;