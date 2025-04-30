const { CourseGradesReview } = require("../database/models/ReviewRequest");

// Create a new review request
exports.createReviewRequest = async (req, res) => {
  try {
    const { courseName, term, studentId, comment } = req.body;

    if (!courseName || !term || !studentId || !comment) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: courseName, term, studentId, or comment",
      });
    }

    // Find the course grades document
    const courseGrades = await CourseGradesReview.findOne({
      courseName,
      term,
      "studentGrades.studentId": studentId
    });

    if (!courseGrades) {
      return res.status(404).json({
        success: false,
        message: "No grades found for the specified course, term and student",
      });
    }

    // Find the specific student's grades
    const studentGrade = courseGrades.studentGrades.find(
      grade => grade.studentId === studentId
    );

    if (!studentGrade) {
      return res.status(404).json({
        success: false,
        message: "Student grades not found",
      });
    }

    // Add the review request to the student's reviewRequests array
    studentGrade.reviewRequests.push({
      comment,
      status: "pending"
    });

    await courseGrades.save();

    res.status(201).json({
      success: true,
      message: "Review request created successfully",
      data: studentGrade.reviewRequests[studentGrade.reviewRequests.length - 1]
    });

  } catch (error) {
    console.error("Create review request error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get all review requests for current user
exports.getMyReviewRequests = async (req, res) => {
  try {
    const { studentId } = req.user; // Assuming this comes from the JWT token

    const courseGrades = await CourseGradesReview.find({
      "studentGrades.studentId": studentId
    });

    const reviewRequests = [];
    courseGrades.forEach(course => {
      const studentGrade = course.studentGrades.find(
        grade => grade.studentId === studentId
      );
      if (studentGrade && studentGrade.reviewRequests) {
        reviewRequests.push({
          courseName: course.courseName,
          term: course.term,
          requests: studentGrade.reviewRequests
        });
      }
    });

    res.status(200).json({
      success: true,
      data: reviewRequests
    });

  } catch (error) {
    console.error("Get review requests error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get specific review request
exports.getReviewRequest = async (req, res) => {
  try {
    const { courseName, term } = req.query;
    const studentId = req.user.studentId; // Get studentId from JWT token

    if (!courseName || !term) {
      return res.status(400).json({
        success: false,
        message: "Missing required query parameters: courseName or term",
      });
    }

    // Find course grades document containing the student's grade
    const courseGrades = await CourseGradesReview.findOne({
      courseName,
      term,
      "studentGrades.studentId": studentId
    });

    if (!courseGrades) {
      return res.status(404).json({
        success: false,
        message: "No grades found for the specified course",
      });
    }

    // Find the specific student grade
    const studentGrade = courseGrades.studentGrades.find(
      grade => grade.studentId === studentId
    );

    if (!studentGrade) {
      return res.status(404).json({
        success: false,
        message: "Student grades not found",
      });
    }

    // Return all review requests for this student in this course
    res.status(200).json({
      success: true,
      data: {
        courseName: courseGrades.courseName,
        term: courseGrades.term,
        studentId: studentGrade.studentId,
        totalGrade: studentGrade.totalGrade,
        gradeByQuestion: studentGrade.gradeByQuestion,
        reviewRequests: studentGrade.reviewRequests
      }
    });

  } catch (error) {
    console.error("Get review requests error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

