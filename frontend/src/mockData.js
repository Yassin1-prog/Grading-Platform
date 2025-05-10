// mock-data.js
// Mock data for the grading system frontend

// Mock Users (Instructors and Students)
const users = [
  {
    _id: "i1",
    username: "prof_smith",
    firstName: "John",
    lastName: "Smith",
    email: "jsmith@university.edu",
    password: "hashed_password",
    role: "instructor",
    studentId: null,
  },
  {
    _id: "i2",
    username: "prof_johnson",
    firstName: "Emily",
    lastName: "Johnson",
    email: "ejohnson@university.edu",
    password: "hashed_password",
    role: "instructor",
    studentId: null,
  },
  {
    _id: "s1",
    username: "student_doe",
    firstName: "Jane",
    lastName: "Doe",
    email: "jdoe@university.edu",
    password: "hashed_password",
    role: "student",
    studentId: "S10001",
  },
  {
    _id: "s2",
    username: "student_brown",
    firstName: "Michael",
    lastName: "Brown",
    email: "mbrown@university.edu",
    password: "hashed_password",
    role: "student",
    studentId: "S10002",
  },
  {
    _id: "s3",
    username: "student_wilson",
    firstName: "Sarah",
    lastName: "Wilson",
    email: "swilson@university.edu",
    password: "hashed_password",
    role: "student",
    studentId: "S10003",
  },
  {
    _id: "s4",
    username: "student_lee",
    firstName: "David",
    lastName: "Lee",
    email: "dlee@university.edu",
    password: "hashed_password",
    role: "student",
    studentId: "S10004",
  },
  {
    _id: "s5",
    username: "student_garcia",
    firstName: "Maria",
    lastName: "Garcia",
    email: "mgarcia@university.edu",
    password: "hashed_password",
    role: "student",
    studentId: "S10005",
  },
  {
    _id: "s6",
    username: "student_chen",
    firstName: "Wei",
    lastName: "Chen",
    email: "wchen@university.edu",
    password: "hashed_password",
    role: "student",
    studentId: "S10006",
  },
  {
    _id: "s7",
    username: "student_patel",
    firstName: "Raj",
    lastName: "Patel",
    email: "rpatel@university.edu",
    password: "hashed_password",
    role: "student",
    studentId: "S10007",
  },
  {
    _id: "s8",
    username: "student_kim",
    firstName: "Ji-Yeon",
    lastName: "Kim",
    email: "jkim@university.edu",
    password: "hashed_password",
    role: "student",
    studentId: "S10008",
  },
];

// Mock Course Grades
const courseGrades = [
  {
    _id: "cg1",
    instructorId: "i1",
    courseName: "Introduction to Computer Science",
    term: "Spring 2025",
    initialSubmissionDate: new Date("2025-04-15"),
    finalSubmissionDate: new Date("2025-05-01"),
    status: true,
    studentGrades: [
      {
        studentId: "S10001",
        totalGrade: 8,
        gradeByQuestion: [9, 8, 7, 9, 8, 7, 9, 8, 7, 8],
        reviewRequests: {
          comment:
            "I believe my answer to question 3 deserves more points as it matches the criteria mentioned in class.",
          response:
            "After reviewing your answer, I agree that it does meet the criteria discussed in class. Your grade has been adjusted.",
          status: "accepted",
        },
      },
      {
        studentId: "S10002",
        totalGrade: 7,
        gradeByQuestion: [7, 7, 6, 8, 7, 7, 6, 8, 7, 7],
        reviewRequests: {
          comment:
            "I think my total grade calculation is incorrect. My individual question grades should add up to more than 7.",
          response: "",
          status: "pending",
        },
      },
      {
        studentId: "S10003",
        totalGrade: 9,
        gradeByQuestion: [9, 9, 9, 9, 8, 9, 10, 9, 9, 9],
        reviewRequests: null,
      },
      {
        studentId: "S10004",
        totalGrade: 6,
        gradeByQuestion: [6, 7, 5, 6, 6, 7, 6, 5, 6, 6],
        reviewRequests: {
          comment:
            "My answer to question 7 included all required elements but was marked down.",
          response:
            "Your answer was missing the discussion of complexity analysis which was required.",
          status: "rejected",
        },
      },
      {
        studentId: "S10005",
        totalGrade: 8,
        gradeByQuestion: [8, 8, 7, 8, 9, 8, 7, 8, 8, 9],
        reviewRequests: null,
      },
    ],
  },
  {
    _id: "cg2",
    instructorId: "i1",
    courseName: "Data Structures",
    term: "Spring 2025",
    initialSubmissionDate: new Date("2025-04-20"),
    finalSubmissionDate: new Date("2025-05-05"),
    status: true,
    studentGrades: [
      {
        studentId: "S10001",
        totalGrade: 9,
        gradeByQuestion: [9, 9, 9, 8, 9, 10, 9, 9, 9, 9],
        reviewRequests: null,
      },
      {
        studentId: "S10003",
        totalGrade: 7,
        gradeByQuestion: [7, 8, 6, 7, 7, 8, 7, 6, 7, 8],
        reviewRequests: null,
      },
      {
        studentId: "S10006",
        totalGrade: 10,
        gradeByQuestion: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        reviewRequests: null,
      },
      {
        studentId: "S10007",
        totalGrade: 8,
        gradeByQuestion: [8, 8, 7, 8, 9, 8, 7, 8, 8, 9],
        reviewRequests: null,
      },
      {
        studentId: "S10008",
        totalGrade: 6,
        gradeByQuestion: [6, 7, 5, 6, 6, 7, 6, 5, 6, 6],
        reviewRequests: {
          comment:
            "I believe I implemented the correct algorithm for question 5.",
          response: "",
          status: "pending",
        },
      },
    ],
  },
  {
    _id: "cg3",
    instructorId: "i2",
    courseName: "Algorithms",
    term: "Spring 2025",
    initialSubmissionDate: new Date("2025-04-25"),
    finalSubmissionDate: null,
    status: false,
    studentGrades: [
      {
        studentId: "S10002",
        totalGrade: 8,
        gradeByQuestion: [8, 8, 7, 9, 8, 7, 8, 9, 8, 8],
        reviewRequests: null,
      },
      {
        studentId: "S10003",
        totalGrade: 9,
        gradeByQuestion: [9, 9, 9, 9, 8, 9, 10, 9, 9, 9],
        reviewRequests: null,
      },
      {
        studentId: "S10004",
        totalGrade: 7,
        gradeByQuestion: [7, 7, 6, 8, 7, 7, 6, 8, 7, 7],
        reviewRequests: null,
      },
      {
        studentId: "S10005",
        totalGrade: 6,
        gradeByQuestion: [6, 7, 5, 6, 6, 7, 6, 5, 6, 6],
        reviewRequests: null,
      },
      {
        studentId: "S10008",
        totalGrade: 8,
        gradeByQuestion: [8, 8, 7, 8, 9, 8, 7, 8, 8, 9],
        reviewRequests: null,
      },
    ],
  },
  {
    _id: "cg4",
    instructorId: "i2",
    courseName: "Database Systems",
    term: "Winter 2024",
    initialSubmissionDate: new Date("2024-12-18"),
    finalSubmissionDate: new Date("2025-01-05"),
    status: true,
    studentGrades: [
      {
        studentId: "S10001",
        totalGrade: 7,
        gradeByQuestion: [7, 8, 6, 7, 7, 8, 7, 6, 7, 8],
        reviewRequests: null,
      },
      {
        studentId: "S10002",
        totalGrade: 9,
        gradeByQuestion: [9, 9, 9, 8, 9, 10, 9, 9, 9, 9],
        reviewRequests: {
          comment:
            "I believe my ERD diagram in question 8 was correct according to the specifications.",
          response:
            "You're correct. I missed that your diagram did include the proper relationships. Grade adjusted.",
          status: "accepted",
        },
      },
      {
        studentId: "S10006",
        totalGrade: 8,
        gradeByQuestion: [8, 8, 7, 9, 8, 7, 8, 9, 8, 8],
        reviewRequests: null,
      },
      {
        studentId: "S10007",
        totalGrade: 6,
        gradeByQuestion: [6, 7, 5, 6, 6, 7, 6, 5, 6, 6],
        reviewRequests: {
          comment:
            "My SQL query in question 4 produces the correct output but was marked down.",
          response:
            "While your query works, it's inefficient due to unnecessary joins. The grade stands.",
          status: "rejected",
        },
      },
    ],
  },
  {
    _id: "cg5",
    instructorId: "i1",
    courseName: "Software Engineering",
    term: "Winter 2024",
    initialSubmissionDate: new Date("2024-12-20"),
    finalSubmissionDate: new Date("2025-01-10"),
    status: true,
    studentGrades: [
      {
        studentId: "S10003",
        totalGrade: 8,
        gradeByQuestion: [8, 8, 7, 9, 8, 7, 8, 9, 8, 8],
        reviewRequests: null,
      },
      {
        studentId: "S10004",
        totalGrade: 9,
        gradeByQuestion: [9, 9, 9, 9, 8, 9, 10, 9, 9, 9],
        reviewRequests: null,
      },
      {
        studentId: "S10005",
        totalGrade: 7,
        gradeByQuestion: [7, 7, 6, 8, 7, 7, 6, 8, 7, 7],
        reviewRequests: null,
      },
      {
        studentId: "S10008",
        totalGrade: 10,
        gradeByQuestion: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        reviewRequests: null,
      },
    ],
  },
];

// Helper function to calculate grade distributions for a course
const calculateGradeDistribution = (course) => {
  // Initialize distribution arrays
  const totalGradeDistribution = Array(11).fill(0); // 0-10 grades
  const questionDistributions = Array(10)
    .fill()
    .map(() => Array(11).fill(0)); // 10 questions, each with 0-10 grades

  course.studentGrades.forEach((student) => {
    // Add to total grade distribution
    totalGradeDistribution[student.totalGrade]++;

    // Add to question-specific distributions
    student.gradeByQuestion.forEach((grade, index) => {
      questionDistributions[index][grade]++;
    });
  });

  return {
    totalGradeDistribution,
    questionDistributions,
  };
};

// Helper function to get courses for a specific student
const getStudentCourses = (studentId) => {
  const studentCoursesData = [];

  courseGrades.forEach((course) => {
    const studentGrade = course.studentGrades.find(
      (grade) => grade.studentId === studentId
    );

    if (studentGrade) {
      studentCoursesData.push({
        courseId: course._id,
        courseName: course.courseName,
        term: course.term,
        status: course.status,
        totalGrade: studentGrade.totalGrade,
        gradeByQuestion: studentGrade.gradeByQuestion,
      });
    }
  });

  return studentCoursesData;
};

// Helper function to get review requests for a student
const getStudentReviewRequests = (studentId) => {
  const reviewRequests = [];

  courseGrades.forEach((course) => {
    const studentGrade = course.studentGrades.find((grade) => {
      // Check if the student has a review request
      grade.studentId == studentId;
    });

    if (studentGrade && studentGrade.reviewRequests) {
      reviewRequests.push({
        courseId: course._id,
        courseName: course.courseName,
        term: course.term,
        totalGrade: studentGrade.totalGrade,
        comment: studentGrade.reviewRequests.comment,
        response: studentGrade.reviewRequests.response,
        requestStatus: studentGrade.reviewRequests.status,
      });
    }
  });

  return reviewRequests;
};

// Helper function to get review requests for an instructor
const getInstructorReviewRequests = (instructorId) => {
  const reviewRequests = [];

  courseGrades.forEach((course) => {
    if (course.instructorId === instructorId) {
      course.studentGrades.forEach((grade) => {
        if (
          grade.reviewRequests &&
          grade.reviewRequests.status == "pending" &&
          course.status == true
        ) {
          const student = users.find(
            (user) => user.studentId === grade.studentId
          );

          reviewRequests.push({
            courseId: course._id,
            courseName: course.courseName,
            term: course.term,
            studentId: grade.studentId,
            studentName: `${student.firstName} ${student.lastName}`,
            totalGrade: grade.totalGrade,
            comment: grade.reviewRequests.comment,
            response: grade.reviewRequests.response,
            status: grade.reviewRequests.status,
          });
        }
      });
    }
  });

  return reviewRequests;
};

// Export all mock data
export const mockData = {
  users,
  courseGrades,

  // Helper functions that would mimic API endpoints
  getCurrentUser: (username) =>
    users.find((user) => user.username === username),
  getAllCourses: () =>
    courseGrades.map((course) => ({
      _id: course._id,
      courseName: course.courseName,
      term: course.term,
      initialSubmissionDate: course.initialSubmissionDate,
      finalSubmissionDate: course.finalSubmissionDate,
      gradeDistribution: calculateGradeDistribution(course),
    })),
  getCourseById: (courseId) => {
    const course = courseGrades.find((c) => c._id === courseId);
    if (course) {
      return {
        ...course,
        gradeDistribution: calculateGradeDistribution(course),
      };
    }
    return null;
  },
  getStudentCourses,
  getInstructorReviewRequests,
  getStudentReviewRequests,
  submitReviewRequest: (studentId, courseId, comment) => {
    // In a real app, this would be an API POST request
    console.log(
      `Review request submitted for student ${studentId} in course ${courseId}: ${comment}`
    );
    return { success: true };
  },
  respondToReviewRequest: (studentId, courseId, response, status) => {
    // In a real app, this would be an API PUT request
    console.log(
      `Response to review request for student ${studentId} in course ${courseId}: ${response} (${status})`
    );
    return { success: true };
  },
  uploadGrades: (instructorId, courseName, term, gradesFile) => {
    // In a real app, this would be an API POST request with file upload
    console.log(
      `Grades uploaded for ${courseName} (${term}) by instructor ${instructorId} file(${gradesFile.name})`
    );
    return { success: true };
  },
};

export default mockData;

// Example usage in frontend components:
/*
import { mockData } from './mock-data';

// Login function
const handleLogin = (username, password) => {
  const user = mockData.getCurrentUser(username);
  if (user && user.password === password) {
    // Login successful
    setCurrentUser(user);
  }
};

// Get all courses for dashboard
const courses = mockData.getAllCourses();

// Get a student's courses
const studentCourses = mockData.getStudentCourses('S10001');

// Get course details with grade distribution
const courseDetails = mockData.getCourseById('cg1');

// Get review requests for an instructor
const reviewRequests = mockData.getInstructorReviewRequests('i1');
*/
