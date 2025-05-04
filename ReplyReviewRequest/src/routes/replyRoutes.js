const express = require("express");
const router = express.Router();
const ReplyreviewController = require("../controllers/ReplyreviewController");
const { verifyToken } = require("../middleware/auth");

// Create a new review request
router.post(
  "/reply-review-request",
  verifyToken,
  ReplyreviewController.replyReviewRequest
);

// Get all review requests for current user
router.get(
  "/my-review-requests-instructor",
  verifyToken,
  ReplyreviewController.getAllReviewRequestsForInstructor
);

module.exports = router;
