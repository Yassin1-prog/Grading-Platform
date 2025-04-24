const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { verifyToken } = require("../middleware/auth");

// Create a new review request
router.post("/review-request", verifyToken, reviewController.createReviewRequest);

// Get all review requests for current user
router.get("/my-review-requests", verifyToken, reviewController.getMyReviewRequests);

// Get specific review request
router.get("/review-request", verifyToken, reviewController.getReviewRequest);

module.exports = router;