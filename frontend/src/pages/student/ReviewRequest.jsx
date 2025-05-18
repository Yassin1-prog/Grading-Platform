"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import { reviewRequestsAPI } from "../../services/api";

const ReviewRequest = () => {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [reviewRequests, setReviewRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get student's courses
        const coursesResponse = await reviewRequestsAPI.getStudentCourses();

        // Format courses for dropdown
        const uniqueCourses = new Set();
        const courseTermPairs = [];

        coursesResponse.courses.forEach((course) => {
          if (course.status !== "closed") {
            // Only include open courses
            const key = `${course.courseName}|${course.term}`;
            if (!uniqueCourses.has(key)) {
              uniqueCourses.add(key);
              courseTermPairs.push({
                courseName: course.courseName,
                term: course.term,
              });
            }
          }
        });

        setCourses(courseTermPairs);

        // Get student's review requests
        const requestsResponse =
          await reviewRequestsAPI.getStudentReviewRequests();
        setReviewRequests(requestsResponse.data || []);

        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, submitSuccess]);

  const handleCourseChange = (e) => {
    const value = e.target.value;
    if (value) {
      const [courseName, term] = value.split("|");
      setSelectedCourse(courseName);
      setSelectedTerm(term);
    } else {
      setSelectedCourse("");
      setSelectedTerm("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse || !selectedTerm || !comment) return;

    setSubmitting(true);
    setError(null);

    try {
      const requestData = {
        courseName: selectedCourse,
        term: selectedTerm,
        studentId: currentUser.studentId,
        comment,
      };

      const result = await reviewRequestsAPI.submitReviewRequest(requestData);

      if (result.success) {
        setSubmitSuccess(true);
        setSelectedCourse("");
        setSelectedTerm("");
        setComment("");
        // Reset success message after 3 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);
      } else {
        setError(result.message || "Failed to submit review request");
      }
    } catch (err) {
      console.error("Error submitting review request:", err);
      setError(err.message);
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

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

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
              value={
                selectedCourse && selectedTerm
                  ? `${selectedCourse}|${selectedTerm}`
                  : ""
              }
              onChange={handleCourseChange}
              required
            >
              <option value="">Select a course</option>
              {courses.map((course, index) => (
                <option
                  key={index}
                  value={`${course.courseName}|${course.term}`}
                >
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
              disabled={
                submitting || !selectedCourse || !selectedTerm || !comment
              }
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
                  <div>{getStatusBadge(request.request.status)}</div>
                </div>
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700">
                    Your Comment:
                  </p>
                  <p className="text-sm mt-1 bg-gray-50 p-2 rounded">
                    {request.request.comment}
                  </p>
                </div>
                {request.request.status !== "pending" &&
                  request.request.response && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700">
                        Instructor Response:
                      </p>
                      <p className="text-sm mt-1 bg-gray-50 p-2 rounded">
                        {request.request.response}
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
