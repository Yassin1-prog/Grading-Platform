"use client";

import { useState, useEffect } from "react";
import { coursesAPI } from "../../services/api";
import GradeDistributionCharts from "../../components/GradeDistributionCharts";

const MyGrades = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentCourses = async () => {
      try {
        setLoading(true);
        const response = await coursesAPI.getStudentCourses();

        // Format the data to match our component expectations
        const formattedCourses = response.grades.map((course) => ({
          courseId: `${course.courseName}-${course.term}`, // Create a unique ID
          courseName: course.courseName,
          term: course.term,
          status: course.status === "closed",
          totalGrade: course.totalGrade,
          gradeByQuestion: course.gradeByQuestion,
          gradeDistribution: {
            totalGradeDistribution: course.totalGradeDistribution,
            questionDistributions: course.questionDistributions,
          },
        }));

        setCourses(formattedCourses);

        if (formattedCourses.length > 0) {
          setSelectedCourse({
            _id: formattedCourses[0].courseId,
            courseName: formattedCourses[0].courseName,
            term: formattedCourses[0].term,
            status: formattedCourses[0].status,
            gradeDistribution: formattedCourses[0].gradeDistribution,
            studentGrade: {
              totalGrade: formattedCourses[0].totalGrade,
              gradeByQuestion: formattedCourses[0].gradeByQuestion,
            },
          });
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching student courses:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentCourses();
  }, []);

  const handleSelectCourse = (courseId) => {
    const course = courses.find((c) => c.courseId === courseId);
    if (course) {
      setSelectedCourse({
        _id: course.courseId,
        courseName: course.courseName,
        term: course.term,
        status: course.status,
        gradeDistribution: course.gradeDistribution,
        studentGrade: {
          totalGrade: course.totalGrade,
          gradeByQuestion: course.gradeByQuestion,
        },
      });
    }
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
        <h1 className="text-2xl font-bold mb-4">My Grades</h1>
        <p className="text-gray-600 mb-6">
          View your grades for all courses. Select a course to see detailed
          breakdown.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="card">
            <h2 className="text-lg font-medium mb-4">My Courses</h2>
            <div className="space-y-2">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <div
                    key={course.courseId}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      selectedCourse && selectedCourse._id === course.courseId
                        ? "bg-indigo-100 border-l-4 border-indigo-500"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => handleSelectCourse(course.courseId)}
                  >
                    <div className="font-medium">{course.courseName}</div>
                    <div className="text-sm text-gray-500">{course.term}</div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm">
                        Grade: {course.totalGrade}/10
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          course.status
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {course.status ? "Closed" : "Open"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No courses found
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          {selectedCourse ? (
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-bold mb-4">
                  {selectedCourse.courseName} - {selectedCourse.term}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Status
                    </h3>
                    <p
                      className={`text-sm font-medium ${
                        selectedCourse.status
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {selectedCourse.status ? "Closed" : "Open"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Your Grade
                    </h3>
                    <p className="text-lg font-bold">
                      {selectedCourse.studentGrade.totalGrade}/10
                    </p>
                  </div>
                </div>

                <h3 className="text-md font-medium mb-2">Question Breakdown</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {selectedCourse.studentGrade.gradeByQuestion.map(
                    (grade, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-2 rounded-md text-center"
                      >
                        <div className="text-xs text-gray-500">
                          Q{index + 1}
                        </div>
                        <div className="font-medium">{grade}/10</div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <GradeDistributionCharts
                gradeDistribution={selectedCourse.gradeDistribution}
                studentGrade={selectedCourse.studentGrade}
              />
            </div>
          ) : (
            <div className="card flex items-center justify-center h-64">
              <p className="text-gray-500">Select a course to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyGrades;
