"use client";

import { useState, useEffect } from "react";
import { mockData } from "../../mockData";
import { useAuth } from "../../context/useAuth";

const ReviewRequest = () => {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [reviewRequests, setReviewRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser && currentUser.studentId) {
          // Get student's courses
          const studentCourses = mockData.getStudentCourses(
            currentUser.studentId
          );
          // Filter to only include courses that are still open for review
          const openCourses = studentCourses.filter((course) => course.status);
          setCourses(openCourses);

          // Get student's review requests
          const requests = mockData.getStudentReviewRequests(
            currentUser.studentId
          );
          setReviewRequests(requests);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, submitSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse || !comment) return;

    setSubmitting(true);
    try {
      // In a real app, this would be an API call
      const result = mockData.submitReviewRequest(
        currentUser.studentId,
        selectedCourse,
        comment
      );

      if (result.success) {
        setSubmitSuccess(true);
        setSelectedCourse("");
        setComment("");

        // Reset success message after 3 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting review request:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case "accepted":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Review Requests</h1>
        <p className="text-gray-600 mb-6">
          Submit a review request for a course grade or check the status of your
          existing requests.
        </p>
      </div>

      <div className="card">
        <h2 className="text-lg font-medium mb-4">Submit New Request</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="course"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Course
            </label>
            <select
              id="course"
              className="form-input"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              required
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.courseId} value={course.courseId}>
                  {course.courseName} - {course.term}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Justification
            </label>
            <textarea
              id="comment"
              rows="4"
              className="form-input"
              placeholder="Explain why you believe your grade should be reviewed..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="flex items-center">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || !selectedCourse || !comment}
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
            {submitSuccess && (
              <span className="ml-4 text-green-600">
                Request submitted successfully!
              </span>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <h2 className="text-lg font-medium mb-4">My Review Requests</h2>
        {reviewRequests.length > 0 ? (
          <div className="space-y-4">
            {reviewRequests.map((request, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">
                      {request.courseName} - {request.term}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Grade: {request.totalGrade}/10
                    </p>
                  </div>
                  <div>{getStatusBadge(request.requestStatus)}</div>
                </div>
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700">
                    Your Comment:
                  </p>
                  <p className="text-sm mt-1 bg-gray-50 p-2 rounded">
                    {request.comment}
                  </p>
                </div>
                {request.requestStatus !== "pending" && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700">
                      Instructor Response:
                    </p>
                    <p className="text-sm mt-1 bg-gray-50 p-2 rounded">
                      {request.response}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No review requests found
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewRequest;
