const { CourseGradesReview } = require("../database/models/ReviewRequest");

// GET /api/reviews/instructor
exports.getAllReviewRequestsForInstructor = async (req, res) => {
  try {
    // 1) Role guard
    if (req.user.role !== "instructor") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: only instructors can view review requests"
      });
    }

    // 2) Pull instructorId from req.user.id
    const instructorId = req.user.id;
    if (!instructorId) {
      return res.status(400).json({
        success: false,
        message: "Bad request: missing instructorId in token"
      });
    }

    console.log(`looking for CourseGradesReview where instructorId = ${instructorId}`);

    // 3) Fetch all courses this instructor posted
    const courses = await CourseGradesReview.find({ instructorId });
    console.log(`  → found ${courses.length} course(s)`);

    // 4) Collect only pending reviewRequests
    const pending = [];
    courses.forEach(course => {
      course.studentGrades.forEach(grade => {
        grade.reviewRequests
          .filter(r => r.status === "pending")
          .forEach(r => {
            pending.push({
              courseName: course.courseName,
              term: course.term,
              studentId: grade.studentId,
              requestId: r._id,
              comment: r.comment,
              requestedAt: r._id.getTimestamp()
            });
          });
      });
    });

    console.log(`  → total pending collected: ${pending.length}`);

    return res.status(200).json({
      success: true,
      data: pending
    });
  } catch (err) {
    console.error("Error in getAllReviewRequestsForInstructor:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// POST /api/reviews/instructor/reply
exports.replyReviewRequest = async (req, res) => {
  try {
    // Role guard
    if (req.user.role !== "instructor") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: only instructors can reply to review requests"
      });
    }

    const instructorId = req.user.id;  // from your JWT
    const { courseName, term, requestId, responseText, status } = req.body;

    // Validate payload (no studentId)
    if (!courseName || !term || !requestId || !responseText) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: courseName, term, requestId, or responseText"
      });
    }

    // Find the course document that contains this reviewRequest
    const courseDoc = await CourseGradesReview.findOne({
      instructorId,
      courseName,
      term,
      "studentGrades.reviewRequests._id": requestId
    });

    if (!courseDoc) {
      return res.status(404).json({
        success: false,
        message: "No matching review request found"
      });
    }

    // Locate the studentGrade and the reviewRequest subdoc
    const studentGrade = courseDoc.studentGrades.find(grade =>
      grade.reviewRequests.id(requestId)
    );
    const reviewReq = studentGrade.reviewRequests.id(requestId);

    // Apply the instructor's response and status
    reviewReq.response = responseText;
    reviewReq.status = ["accepted", "rejected"].includes(status) ? status : "accepted";

    await courseDoc.save();

    // Return the saved reply, now including the studentId we pulled out
    return res.status(200).json({
      success: true,
      message: "Reply saved successfully",
      data: {
        requestId: reviewReq._id,
        courseName,
        term,
        studentId: studentGrade.studentId,
        comment: reviewReq.comment,
        response: reviewReq.response,
        status: reviewReq.status
      }
    });
  } catch (err) {
    console.error("Error in replyReviewRequest:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};