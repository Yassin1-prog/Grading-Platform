const { CourseGradesReview } = require("../database/models/ReviewRequest");
const { publishReviewRequest } = require("../services/reviewMessagePublisher");

// Create a new review request
exports.createReviewRequest = async (req, res) => {
  try {
    const { courseName, term, studentId, comment } = req.body;

    if (!courseName || !term || !studentId || !comment) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: courseName, term, studentId, or comment",
      });
    }

    // Find the course grades document
    const courseGrades = await CourseGradesReview.findOne({
      courseName,
      term,
      "studentGrades.studentId": studentId,
    });

    if (!courseGrades) {
      return res.status(404).json({
        success: false,
        message: "No grades found for the specified course, term and student",
      });
    }

    if (courseGrades.status == "closed") {
      return res.status(400).json({
        success: false,
        message: "The review request period is closed for this course",
      });
    }

    // Find the specific student's grades
    const studentGrade = courseGrades.studentGrades.find(
      (grade) => grade.studentId === studentId
    );

    // check if the student has already submitted a review request
    if (studentGrade.reviewRequests) {
      return res.status(409).json({
        success: false,
        message: `A review request has arleady been made for this course`,
      });
    }

    // Add the review request to the student's reviewRequests array
    studentGrade.reviewRequests = {
      comment: comment,
      status: "pending",
    };

    await courseGrades.save();

    // Publish to RabbitMQ for Reply to Review Request service
    await publishReviewRequest({
      courseName,
      term,
      studentId,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Review request created successfully",
      data: studentGrade.reviewRequests,
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
      "studentGrades.studentId": studentId,
    });

    const reviewRequests = [];
    courseGrades.forEach((course) => {
      const studentGrade = course.studentGrades.find(
        (grade) => grade.studentId === studentId
      );

      if (studentGrade && studentGrade.reviewRequests) {
        reviewRequests.push({
          courseName: course.courseName,
          term: course.term,
          totalGrade: studentGrade.totalGrade,
          request: studentGrade.reviewRequests,
        });
      }
    });

    res.status(200).json({
      success: true,
      data: reviewRequests,
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

// get my courses
exports.getPersonalCourses = async (req, res, next) => {
  try {
    const studentId = req.user.studentId;

    const courses = await CourseGradesReview.find({
      "studentGrades.studentId": studentId,
    });

    const personalCourses = courses.map((course) => {
      return {
        courseName: course.courseName,
        term: course.term,
        status: course.status,
      };
    });

    res.json({
      studentId,
      courses: personalCourses,
    });
  } catch (error) {
    next(error);
  }
};
