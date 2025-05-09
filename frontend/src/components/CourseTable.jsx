"use client";

import { useState } from "react";

const CourseTable = ({ courses, onSelectCourse }) => {
  const [sortField, setSortField] = useState("courseName");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString();
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.term.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (
      sortField === "initialSubmissionDate" ||
      sortField === "finalSubmissionDate"
    ) {
      const dateA = a[sortField] ? new Date(a[sortField]) : new Date(0);
      const dateB = b[sortField] ? new Date(b[sortField]) : new Date(0);
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }

    if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? "↑" : "↓";
  };

  return (
    <div className="card">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search courses..."
          className="form-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="table-container">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th
                className="cursor-pointer"
                onClick={() => handleSort("courseName")}
              >
                Course Name {getSortIcon("courseName")}
              </th>
              <th className="cursor-pointer" onClick={() => handleSort("term")}>
                Term {getSortIcon("term")}
              </th>
              <th
                className="cursor-pointer"
                onClick={() => handleSort("initialSubmissionDate")}
              >
                Initial Submission {getSortIcon("initialSubmissionDate")}
              </th>
              <th
                className="cursor-pointer"
                onClick={() => handleSort("finalSubmissionDate")}
              >
                Final Submission {getSortIcon("finalSubmissionDate")}
              </th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedCourses.map((course) => (
              <tr
                key={course._id}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => onSelectCourse(course)}
              >
                <td className="font-medium text-gray-900">
                  {course.courseName}
                </td>
                <td>{course.term}</td>
                <td>{formatDate(course.initialSubmissionDate)}</td>
                <td>{formatDate(course.finalSubmissionDate)}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      course.status
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {course.status ? "Closed" : "Open"}
                  </span>
                </td>
              </tr>
            ))}
            {sortedCourses.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No courses found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseTable;
