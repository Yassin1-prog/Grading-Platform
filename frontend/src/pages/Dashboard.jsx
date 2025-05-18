"use client";

import { useState, useEffect } from "react";
import { coursesAPI } from "../services/api";
import CourseTable from "../components/CourseTable";
import GradeDistributionCharts from "../components/GradeDistributionCharts";

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await coursesAPI.getAllCourses();

        // Format the data to match our component expectations
        const formattedCourses = response.grades.map((course) => ({
          _id: `${course.courseName}-${course.term}`, // Create a unique ID
          courseName: course.courseName,
          term: course.term,
          initialSubmissionDate: course.inititalSubmissionDate,
          finalSubmissionDate: course.finalSubmissionDate,
          status: course.status === "closed",
          gradeDistribution: {
            totalGradeDistribution: course.totalGradeDistribution,
            questionDistributions: course.questionDistributions,
          },
        }));

        setCourses(formattedCourses);

        if (formattedCourses.length > 0) {
          setSelectedCourse(formattedCourses[0]);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Welcome to the Grading System Dashboard. Here you can view all courses
          and their grade distributions.
        </p>
      </div>

      <CourseTable courses={courses} onSelectCourse={handleSelectCourse} />

      {selectedCourse && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">
            {selectedCourse.courseName} - {selectedCourse.term}
          </h2>
          <GradeDistributionCharts
            gradeDistribution={selectedCourse.gradeDistribution}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
