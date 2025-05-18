const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken } = require("../middleware/auth");

// Register route
router.post("/register", userController.register);

// Login route (for all users)
router.post("/login", userController.login);

// Get current user profile
router.get("/me", verifyToken, userController.getCurrentUser);

// get all students details
router.get("/users", verifyToken, userController.getAllStudents);

module.exports = router;
