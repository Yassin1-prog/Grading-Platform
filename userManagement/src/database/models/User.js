const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "instructor"], // Optional: restrict to specific roles
    default: "student", // Optional: set a default role
  },
  studentId: {
    type: String,
    sparse: true, // This allows the field to be null/undefined but ensures uniqueness when it exists
  },
});

module.exports = mongoose.model("User", UserSchema);
