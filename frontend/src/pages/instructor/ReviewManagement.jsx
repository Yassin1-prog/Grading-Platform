"use client";

import { useState, useEffect } from "react";
import { mockData } from "../../mockData";
import { useAuth } from "../../context/AuthContext";

const ReviewManagement = () => {
  const { currentUser } = useAuth();
  const [reviewRequests, setReviewRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState("accepted");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchReviewRequests = async () => {
      try {
        if (currentUser && currentUser._id) {
          const requests = mockData.getInstructorReviewRequests(
            currentUser._id
          );
          setReviewRequests(requests);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching review requests:", error);
        setLoading(false);
      }
    };

    fetchReviewRequests();
  }, [currentUser, submitSuccess]);

  const handleSelectRequest = (request) => {
    setSelectedRequest(request);
    setResponse("");
    setStatus("accepted");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRequest || !response) return;

    setSubmitting(true);
    try {
      // In a real app, this would be an API call
      const result = mockData.respondToReviewRequest(
        selectedRequest.studentId,
        selectedRequest.courseId,
        response,
        status
      );

      if (result.success) {
        setSubmitSuccess(true);
        setSelectedRequest(null);
        setResponse("");

        // Reset success message after 3 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting response:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRequests =
    filter === "all"
      ? reviewRequests
      : reviewRequests.filter((req) =>
          req.courseName.toLowerCase().includes(filter.toLowerCase())
        );

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
        <h1 className="text-2xl font-bold mb-4">Review Request Management</h1>
        <p className="text-gray-600 mb-6">
          Manage grade review requests from students for your courses.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Pending Requests</h2>
              <div>
                <select
                  className="form-input py-1 text-sm"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Courses</option>
                  {[
                    ...new Set(reviewRequests.map((req) => req.courseName)),
                  ].map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      selectedRequest &&
                      selectedRequest.studentId === request.studentId &&
                      selectedRequest.courseId === request.courseId
                        ? "bg-indigo-100 border-l-4 border-indigo-500"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => handleSelectRequest(request)}
                  >
                    <div className="font-medium">{request.studentName}</div>
                    <div className="text-sm text-gray-500">
                      {request.courseName}
                    </div>
                    <div className="text-sm text-gray-500">{request.term}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No pending review requests
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          {selectedRequest ? (
            <div className="card">
              <h2 className="text-lg font-medium mb-4">
                Review Request Details
              </h2>
              <div className="mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Student
                    </h3>
                    <p className="font-medium">{selectedRequest.studentName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Course
                    </h3>
                    <p className="font-medium">
                      {selectedRequest.courseName} - {selectedRequest.term}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Student ID
                    </h3>
                    <p className="font-medium">{selectedRequest.studentId}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Current Grade
                    </h3>
                    <p className="font-medium">
                      {selectedRequest.totalGrade}/10
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Student's Comment
                </h3>
                <div className="bg-gray-50 p-3 rounded-md text-sm">
                  {selectedRequest.comment}
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="response"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Response
                  </label>
                  <textarea
                    id="response"
                    rows="4"
                    className="form-input"
                    placeholder="Provide your response to the student's request..."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Decision
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        name="status"
                        value="accepted"
                        checked={status === "accepted"}
                        onChange={() => setStatus("accepted")}
                      />
                      <span className="ml-2">Accept Request</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        name="status"
                        value="rejected"
                        checked={status === "rejected"}
                        onChange={() => setStatus("rejected")}
                      />
                      <span className="ml-2">Reject Request</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting || !response}
                  >
                    {submitting ? "Submitting..." : "Submit Response"}
                  </button>
                  {submitSuccess && (
                    <span className="ml-4 text-green-600">
                      Response submitted successfully!
                    </span>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <div className="card flex items-center justify-center h-64">
              <p className="text-gray-500">
                Select a review request to respond
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewManagement;
