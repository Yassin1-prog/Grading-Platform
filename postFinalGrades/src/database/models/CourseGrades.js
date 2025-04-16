const mongoose = require("mongoose");

const StudentGradeSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true },
    totalGrade: { type: Number, required: true },
  },
  { _id: false }
);

const CourseGradesSchema = new mongoose.Schema({
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  courseName: { type: String, required: true },
  term: { type: String, required: true },
  initialSubmissionDate: { type: Date },
  finalSubmissionDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["initial", "finalized"],
    default: "finalized",
  },
  studentGrades: [StudentGradeSchema],
});

// Compound index for efficient querying
CourseGradesSchema.index(
  { instructorId: 1, courseName: 1, term: 1 },
  { unique: true }
);

module.exports = mongoose.model("CourseGrades", CourseGradesSchema);
