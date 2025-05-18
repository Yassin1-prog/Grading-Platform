const CourseGrades = require("../database/models/CourseGrades");

// Helper function to calculate grade distributions for a course
const calculateGradeDistribution = (course) => {
  // Initialize distribution arrays
  const totalGradeDistribution = Array(11).fill(0); // 0-10 grades
  const questionDistributions = Array(10)
    .fill()
    .map(() => Array(11).fill(0)); // 10 questions, each with 0-10 grades

  course.studentGrades.forEach((student) => {
    // Add to total grade distribution
    totalGradeDistribution[student.totalGrade]++;

    // Add to question-specific distributions
    student.gradeByQuestion.forEach((grade, index) => {
      questionDistributions[index][grade]++;
    });
  });

  return {
    totalGradeDistribution,
    questionDistributions,
  };
};

const getStatistics = async (req, res, next) => {
  try {
    const courses = await CourseGrades.find({});

    const coursesGrades = courses.map((course) => {
      const { totalGradeDistribution, questionDistributions } =
        calculateGradeDistribution(course);
      return {
        courseName: course.courseName,
        term: course.term,
        inititalSubmissionDate: course.initialSubmissionDate,
        finalSubmissionDate: course.finalSubmissionDate,
        status: course.status,
        totalGradeDistribution,
        questionDistributions,
      };
    });

    if (!coursesGrades.length) {
      return res.status(404).json({ message: "No grades found" });
    }

    res.json({
      grades: coursesGrades,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStatistics };
