"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/useAuth";
import { reviewRequestsAPI, authAPI } from "../../services/api";

const ReviewManagement = () => {
  const { currentUser } = useAuth();
  const [reviewRequests, setReviewRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState("accepted");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("courseName");
  const [sortDirection, setSortDirection] = useState("asc");
  const [users, setUsers] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch review requests
        const requestsResponse =
          await reviewRequestsAPI.getInstructorReviewRequests();

        // Fetch users to get student names
        const usersResponse = await authAPI.getUsers();

        if (usersResponse.success) {
          setUsers(usersResponse.data);
        } else {
          console.error("Failed to load users:", usersResponse.message);
        }

        if (requestsResponse.success) {
          setReviewRequests(requestsResponse.data || []);
        } else {
          setError(
            requestsResponse.message || "Failed to load review requests"
          );
        }
      } catch (err) {
        console.error("Error fetching review requests:", err);
        setError("Failed to load review requests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, submitSuccess, refreshTrigger]);

  const getStudentName = (studentId) => {
    const student = users.find((user) => user.studentId === studentId);
    return student ? `${student.firstName} ${student.lastName}` : studentId;
  };

  const handleSelectRequest = (request) => {
    setSelectedRequest({
      ...request,
      studentName: getStudentName(request.studentId),
    });
    setResponse("");
    setStatus("accepted");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRequest || !response) return;

    setSubmitting(true);
    setError(null);

    try {
      const replyData = {
        courseName: selectedRequest.courseName,
        term: selectedRequest.term,
        studentId: selectedRequest.studentId,
        responseText: response,
        status,
      };

      const result = await reviewRequestsAPI.replyToReviewRequest(replyData);

      if (result.success) {
        setSubmitSuccess(true);
        setSelectedRequest(null);
        setResponse("");

        // Reset success message after 3 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);
      } else {
        setError(result.message || "Failed to submit response");
      }
    } catch (err) {
      console.error("Error submitting response:", err);
      setError(
        "An error occurred while submitting your response. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return null;
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const filteredAndSortedRequests = useMemo(() => {
    // First filter by course if needed
    let filtered = reviewRequests;
    if (filter !== "all") {
      filtered = filtered.filter((req) => req.courseName === filter);
    }

    // Then filter by search term if provided
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (req) =>
          req.courseName.toLowerCase().includes(term) ||
          req.term.toLowerCase().includes(term) ||
          getStudentName(req.studentId).toLowerCase().includes(term) ||
          req.studentId.toLowerCase().includes(term)
      );
    }

    // Then sort
    return [...filtered].sort((a, b) => {
      let valueA, valueB;

      if (sortBy === "studentName") {
        valueA = getStudentName(a.studentId);
        valueB = getStudentName(b.studentId);
      } else {
        valueA = a[sortBy];
        valueB = b[sortBy];
      }

      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [reviewRequests, filter, searchTerm, sortBy, sortDirection, users]);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
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
        <h1 className="text-2xl font-bold mb-4">Review Request Management</h1>
        <p className="text-gray-600 mb-6">
          Manage grade review requests from students for your courses.
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Pending Requests</h2>
              <button
                onClick={handleRefresh}
                className="p-1 rounded-full hover:bg-gray-100"
                title="Refresh requests"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-4 space-y-2">
              <div>
                <select
                  className="form-input py-1 text-sm w-full"
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
              <div>
                <input
                  type="text"
                  placeholder="Search by name or ID..."
                  className="form-input py-1 text-sm w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-md border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("studentName")}
                    >
                      Student {getSortIcon("studentName")}
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("courseName")}
                    >
                      Course {getSortIcon("courseName")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedRequests.length > 0 ? (
                    filteredAndSortedRequests.map((request, index) => (
                      <tr
                        key={index}
                        className={`hover:bg-gray-50 cursor-pointer ${
                          selectedRequest &&
                          selectedRequest.studentId === request.studentId &&
                          selectedRequest.courseName === request.courseName &&
                          selectedRequest.term === request.term
                            ? "bg-indigo-50"
                            : ""
                        }`}
                        onClick={() => handleSelectRequest(request)}
                      >
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {getStudentName(request.studentId)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {request.studentId}
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {request.courseName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {request.term}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="2"
                        className="px-4 py-4 text-center text-sm text-gray-500"
                      >
                        No pending review requests
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
                <div className="bg-gray-50 p-3 rounded-md text-sm border border-gray-200">
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
                        className="form-radio text-indigo-600"
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
                        className="form-radio text-red-600"
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
                    className={`btn ${
                      status === "accepted" ? "btn-success" : "btn-danger"
                    }`}
                    disabled={submitting || !response}
                  >
                    {submitting ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : status === "accepted" ? (
                      "Accept and Submit Response"
                    ) : (
                      "Reject and Submit Response"
                    )}
                  </button>
                  {submitSuccess && (
                    <div className="ml-4 text-green-600 flex items-center">
                      <svg
                        className="h-5 w-5 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Response submitted successfully!
                    </div>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <div className="card flex flex-col items-center justify-center h-64">
              <svg
                className="h-12 w-12 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-gray-500 text-center">
                {reviewRequests.length > 0
                  ? "Select a review request to respond"
                  : "No pending review requests found"}
              </p>
              {reviewRequests.length === 0 && (
                <button
                  onClick={handleRefresh}
                  className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Refresh
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewManagement;
