const express = require("express");
const router = express.Router();

const {
  scanPass,
  getGateLogs,
} = require("../controllers/gateController");

router.post("/scan", scanPass);

router.get("/logs", getGateLogs);

module.exports = router;