"use client";

import { useState } from "react";
import { mockData } from "../../mockData";
import { useAuth } from "../../context/useAuth";

const GradeUpload = () => {
  const { currentUser } = useAuth();
  const [courseName, setCourseName] = useState("");
  const [term, setTerm] = useState("");
  const [numGrades, setNumGrades] = useState("");
  const [file, setFile] = useState(null);
  const [submissionType, setSubmissionType] = useState("initial"); // Added for initial/final selection
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setFile(selectedFile);
      setError("");
    } else {
      setFile(null);
      setError("Please select a valid Excel file (.xlsx)");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseName || !term || !numGrades || !file) {
      setError("Please fill in all fields and upload a file");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // In a real app, this would be an API call with file upload
      const result = mockData.uploadGrades(
        currentUser._id,
        courseName,
        term,
        file
      );

      if (result.success) {
        setUploadSuccess(true);
        setCourseName("");
        setTerm("");
        setNumGrades("");
        setFile(null);
        setSubmissionType("initial");

        // Reset success message after 3 seconds
        setTimeout(() => {
          setUploadSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error uploading grades:", error);
      setError("An error occurred while uploading grades");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Grade Upload</h1>
        <p className="text-gray-600 mb-6">
          Upload Excel files containing student grades for your courses.
        </p>
      </div>

      <div className="card max-w-2xl mx-auto">
        <h2 className="text-lg font-medium mb-6">Upload Grades</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="courseName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Course Name
            </label>
            <input
              type="text"
              id="courseName"
              className="form-input"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="term"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Term
            </label>
            <input
              type="text"
              id="term"
              className="form-input"
              placeholder="e.g., Spring 2025"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="numGrades"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Number of Grades
            </label>
            <input
              type="number"
              id="numGrades"
              className="form-input"
              min="1"
              value={numGrades}
              onChange={(e) => setNumGrades(e.target.value)}
              required
            />
          </div>

          {/* Added submission type selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Submission Type
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="submissionType"
                  value="initial"
                  checked={submissionType === "initial"}
                  onChange={() => setSubmissionType("initial")}
                />
                <span className="ml-2">Initial Submission</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="submissionType"
                  value="final"
                  checked={submissionType === "final"}
                  onChange={() => setSubmissionType("final")}
                />
                <span className="ml-2">Final Submission</span>
              </label>
            </div>
          </div>

          <div>
            <label
              htmlFor="file"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Upload Excel File
            </label>
            <input
              type="file"
              id="file"
              className="form-input"
              accept=".xlsx"
              onChange={handleFileChange}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Only Excel files (.xlsx) are accepted. The file should contain
              student IDs and grades.
            </p>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <div className="flex items-center">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={
                uploading || !courseName || !term || !numGrades || !file
              }
            >
              {uploading ? "Uploading..." : "Upload Grades"}
            </button>
            {uploadSuccess && (
              <span className="ml-4 text-green-600">
                Grades uploaded successfully!
              </span>
            )}
          </div>
        </form>
      </div>

      <div className="card max-w-2xl mx-auto">
        <h2 className="text-lg font-medium mb-4">File Format Instructions</h2>
        <div className="space-y-2 text-sm">
          <p>The Excel file should follow this format:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>First column: Student ID</li>
            <li>Second column: Total Grade (0-10)</li>
            <li>Subsequent columns: Individual question grades (0-10)</li>
          </ul>
          <p className="mt-2">Example:</p>
          <div className="bg-gray-50 p-3 rounded-md font-mono text-xs">
            <p>Student ID | Total Grade | Q1 | Q2 | Q3 | ... | Q10</p>
            <p>S10001 | 8 | 9 | 8 | 7 | 9 | 8 | 7 | 9 | 8 | 7 | 8</p>
            <p>S10002 | 7 | 7 | 7 | 6 | 8 | 7 | 7 | 6 | 8 | 7 | 7</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeUpload;
