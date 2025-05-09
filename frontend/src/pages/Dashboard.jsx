"use client";

import { useState, useEffect } from "react";
import { mockData } from "../mockData";
import { useAuth } from "../context/AuthContext";
import CourseTable from "../components/CourseTable";
import GradeDistributionCharts from "../components/GradeDistributionCharts";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [studentGrade, setStudentGrade] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all courses
    const fetchCourses = async () => {
      try {
        const allCourses = mockData.getAllCourses();
        setCourses(allCourses);

        if (allCourses.length > 0) {
          setSelectedCourse(allCourses[0]);

          // If user is a student, get their grade for the selected course
          if (currentUser.role === "student") {
            const courseDetails = mockData.getCourseById(allCourses[0]._id);
            const studentGradeInfo = courseDetails.studentGrades.find(
              (grade) => grade.studentId === currentUser.studentId
            );
            setStudentGrade(studentGradeInfo || null);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, [currentUser]);

  const handleSelectCourse = async (course) => {
    setSelectedCourse(course);

    // If user is a student, get their grade for the selected course
    if (currentUser.role === "student") {
      const courseDetails = mockData.getCourseById(course._id);
      const studentGradeInfo = courseDetails.studentGrades.find(
        (grade) => grade.studentId === currentUser.studentId
      );
      setStudentGrade(studentGradeInfo || null);
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
            studentGrade={studentGrade}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
