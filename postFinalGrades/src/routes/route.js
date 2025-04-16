const express = require("express");
const router = express.Router();
const postFinalController = require("../controllers/controller");
const { upload } = require("../middleware/upload");
const { verifyToken } = require("../middleware/auth");

// Register route
router.post(
  "/postFinalGrades",
  verifyToken,
  upload.single("file"),
  postFinalController.processGradesFile
);

module.exports = router;
