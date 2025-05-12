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

// Επιστρέφει τις βαθμολογίες του authenticated φοιτητή
const getPersonalGrades = async (req, res, next) => {
  try {
    const studentId = req.user.studentId;

    const courses = await CourseGrades.find({
      "studentGrades.studentId": studentId,
    });

    const personalGrades = courses.map((course) => {
      const grade = course.studentGrades.find((g) => g.studentId === studentId);
      const { totalGradeDistribution, questionDistributions } =
        calculateGradeDistribution(course);
      return {
        courseName: course.courseName,
        term: course.term,
        status: course.status,
        totalGrade: grade.totalGrade,
        gradeByQuestion: grade.gradeByQuestion,
        totalGradeDistribution,
        questionDistributions,
      };
    });

    if (!personalGrades.length) {
      return res
        .status(404)
        .json({ message: "No grades found for this student" });
    }

    res.json({
      studentId,
      grades: personalGrades,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPersonalGrades };
