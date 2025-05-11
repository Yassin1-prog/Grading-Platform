const express = require("express");
const router = express.Router();
const { getPersonalGrades } = require("../controllers/personalGradesController");
const { verifyToken } = require("../middleware/auth");

router.get("/grades/mine", verifyToken, getPersonalGrades);

module.exports = router;
