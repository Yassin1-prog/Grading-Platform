const express = require("express");
const router = express.Router();
const { getStatistics } = require("../controllers/statisticsController");
const { verifyToken } = require("../middleware/auth"); 

router.get("/statistics", verifyToken, getStatistics);

module.exports = router;
