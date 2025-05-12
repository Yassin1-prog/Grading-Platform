const mongoose = require("mongoose");

const ReviewRequestSchema = new mongoose.Schema(
  {
    comment: { type: String, required: true },
    response: { type: String }, // Changed to not required since it will be added later
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { _id: false }
);

const StudentGradeSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true },
    totalGrade: { type: Number, required: true },
    gradeByQuestion: [Number],
    reviewRequests: ReviewRequestSchema,
  },
  { _id: false }
);

const CourseGradesReviewSchema = new mongoose.Schema({
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  courseName: { type: String, required: true },
  term: { type: String, required: true },
  initialSubmissionDate: { type: Date, required: true },
  finalSubmissionDate: Date,
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
  },
  studentGrades: [StudentGradeSchema],
});

// Compound index for efficient querying
CourseGradesReviewSchema.index(
  { instructorId: 1, courseName: 1, term: 1, status: 1 },
  { unique: true }
);

module.exports = {
  CourseGradesReview: mongoose.model(
    "CourseGradesReview",
    CourseGradesReviewSchema
  ),
};
