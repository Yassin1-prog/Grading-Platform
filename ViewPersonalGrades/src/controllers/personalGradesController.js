const CourseGrades = require("../database/models/CourseGrades");

// Επιστρέφει τις βαθμολογίες του authenticated φοιτητή
const getPersonalGrades = async (req, res, next) => {
  try {
    const studentId = req.user.studentId;

    // Αναζήτηση όλων των μαθημάτων με τελική βαθμολογία όπου υπάρχει ο φοιτητής
    const courses = await CourseGrades.find({
      status: "final",
      "studentGrades.studentId": studentId,
    });

    // Δημιουργία απάντησης μόνο με τις βαθμολογίες του συγκεκριμένου φοιτητή
    const personalGrades = courses.map(course => {
      const grade = course.studentGrades.find(g => g.studentId === studentId);
      return {
        courseName: course.courseName,
        term: course.term,
        totalGrade: grade.totalGrade,
        gradeByQuestion: grade.gradeByQuestion,
      };
    });

    if (!personalGrades.length) {
      return res.status(404).json({ message: "No grades found for this student" });
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
