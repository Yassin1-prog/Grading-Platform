const express = require("express");
const router = express.Router();
const postInitialController = require("../controllers/controller");
const { upload } = require("../middleware/upload");
const { verifyToken } = require("../middleware/auth");

// Register route
router.post(
  "/postInitialGrades",
  verifyToken,
  upload.single("file"),
  postInitialController.processInitialGradesFile
);

router.post(
  "/postFinalGrades",
  verifyToken,
  upload.single("file"),
  postInitialController.processFinalGradesFile
);

module.exports = router;
