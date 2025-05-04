const CourseGrades = require("../database/models/CourseGrades");

// 🔹 Compute five-number summary: min, Q1, median, Q3, max
const calculateFiveNumSummary = (grades) => {
  if (!grades.length) {
    return { min: 0, q1: 0, median: 0, q3: 0, max: 0 };
  }

  const sorted = grades.map(g => g.totalGrade).sort((a, b) => a - b);
  const len = sorted.length;

  const getPercentile = (p) => {
    const index = (p / 100) * (len - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    return (1 - weight) * sorted[lower] + weight * sorted[upper];
  };

  return {
    min: sorted[0],
    q1: getPercentile(25),
    median: getPercentile(50),
    q3: getPercentile(75),
    max: sorted[len - 1]
  };
};

// 🔹 Create exact integer frequency from 0 to 10
const calculateGradeFrequency = (grades) => {
  const distribution = {};

  for (let i = 0; i <= 10; i++) {
    distribution[i] = 0;
  }

  grades.forEach(({ totalGrade }) => {
    const rounded = Math.round(totalGrade);
    if (rounded >= 0 && rounded <= 10) {
      distribution[rounded]++;
    }
  });

  return distribution;
};

const getStatistics = async (req, res, next) => {
  try {
    const { courseName, term } = req.query;
    if (!courseName || !term) {
      return res.status(400).json({ error: "courseName and term are required" });
    }

    const course = await CourseGrades.findOne({
      courseName,
      term,
      status: "final"
    });

    if (!course || !course.studentGrades?.length) {
      return res.status(404).json({ error: "No final grades found for this course/term" });
    }

    const grades = course.studentGrades;

    const fiveNumberSummary = calculateFiveNumSummary(grades);
    const gradeDistribution = calculateGradeFrequency(grades);

    res.json({
      courseName,
      term,
      totalStudents: grades.length,
      fiveNumberSummary,
      gradeDistribution
    });

  } catch (err) {
    next(err);
  }
};

module.exports = { getStatistics };
