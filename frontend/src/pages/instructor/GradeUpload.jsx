"use client";

import { useState, useRef } from "react";
//import { useAuth } from "../../context/AuthContext";
import { gradeUploadAPI } from "../../services/api";

const GradeUpload = () => {
  //const { currentUser } = useAuth();
  const [courseName, setCourseName] = useState("");
  const [term, setTerm] = useState("");
  const [numberOfGrades, setNumberOfGrades] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [submissionType, setSubmissionType] = useState("initial");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      setFile(null);
      setFileName("");
      return;
    }

    // Check file type
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (!validTypes.includes(selectedFile.type)) {
      setFile(null);
      setFileName("");
      setError("Please select a valid Excel file (.xlsx or .xls)");
      return;
    }

    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setFile(null);
      setFileName("");
      setError("File size exceeds 5MB limit");
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setError("");
  };

  const resetForm = () => {
    setCourseName("");
    setTerm("");
    setNumberOfGrades("");
    setFile(null);
    setFileName("");
    setSubmissionType("initial");
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseName || !term || !numberOfGrades || !file) {
      setError("Please fill in all fields and upload a file");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError("");

    try {
      // Create form data
      const formData = new FormData();
      formData.append("file", file);

      // Add JSON data
      const jsonData = {
        courseName,
        term,
        numberOfGrades: Number.parseInt(numberOfGrades, 10),
      };
      formData.append("data", JSON.stringify(jsonData));

      // Choose the appropriate endpoint based on submission type
      const uploadFunction =
        submissionType === "initial"
          ? gradeUploadAPI.uploadInitialGrades
          : gradeUploadAPI.uploadFinalGrades;

      // Create config with upload progress tracking
      const config = {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      };

      const result = await uploadFunction(formData, config);

      if (result.message === "Grades processed successfully") {
        setUploadSuccess(true);
        resetForm();

        // Reset success message after 3 seconds
        setTimeout(() => {
          setUploadSuccess(false);
        }, 3000);
      } else {
        setError(result.message || "Failed to upload grades");
      }
    } catch (err) {
      console.error("Error uploading grades:", err);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(
          `Server error: ${
            err.response.data.message || err.response.statusText
          }`
        );
      } else if (err.request) {
        // The request was made but no response was received
        setError(
          "No response from server. Please check your connection and try again."
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Error: ${err.error}`);
      }
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
              disabled={uploading}
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
              disabled={uploading}
              required
            />
          </div>

          <div>
            <label
              htmlFor="numberOfGrades"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Number of Grades
            </label>
            <input
              type="number"
              id="numberOfGrades"
              className="form-input"
              min="1"
              value={numberOfGrades}
              onChange={(e) => setNumberOfGrades(e.target.value)}
              disabled={uploading}
              required
            />
          </div>

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
                  disabled={uploading}
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
                  disabled={uploading}
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
            <div className="flex items-center mt-1">
              <label className="block w-full">
                <span className="sr-only">Choose file</span>
                <input
                  type="file"
                  id="file"
                  ref={fileInputRef}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  disabled={uploading}
                  required
                />
              </label>
            </div>
            {fileName && (
              <div className="mt-2 text-sm text-gray-600 flex items-center">
                <svg
                  className="h-4 w-4 mr-1 text-green-500"
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
                {fileName}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Only Excel files (.xlsx, .xls) are accepted. Maximum file size:
              5MB.
            </p>
          </div>

          {uploading && (
            <div className="mt-2">
              <div className="text-xs text-gray-500 mb-1">
                Uploading: {uploadProgress}%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex items-center">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={
                uploading || !courseName || !term || !numberOfGrades || !file
              }
            >
              {uploading ? (
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
                  Uploading...
                </span>
              ) : (
                "Upload Grades"
              )}
            </button>
            {uploadSuccess && (
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
                Grades uploaded successfully!
              </div>
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
          <div className="mt-4 bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
            <p className="font-medium text-yellow-800">Important Notes:</p>
            <ul className="list-disc pl-5 mt-1 text-yellow-700">
              <li>Make sure all student IDs exist in the system</li>
              <li>All grades must be integers between 0 and 10</li>
              <li>
                {submissionType === "initial"
                  ? "Initial submissions can be updated later with a final submission"
                  : "Final submissions cannot be changed once uploaded"}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeUpload;
