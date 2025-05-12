const mongoose = require("mongoose");

const StudentGradeSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true },
    totalGrade: { type: Number, required: true },
    gradeByQuestion: [Number],
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
  initialSubmissionDate: { type: Date, required: true },
  finalSubmissionDate: Date,
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
  },
  studentGrades: [StudentGradeSchema],
});

CourseGradesSchema.index(
  { instructorId: 1, courseName: 1, term: 1, status: 1 },
  { unique: true }
);

module.exports = mongoose.model("CourseGrades", CourseGradesSchema);
