const express = require("express");
const router = express.Router();

const { scanPass } = require("../controllers/gateController");

router.post("/scan", scanPass);

module.exports = router;