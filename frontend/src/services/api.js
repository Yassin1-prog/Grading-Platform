import axios from "axios";

const API_URL = "http://localhost:8080";

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication API
export const authAPI = {
  login: async (username, password) => {
    try {
      const response = await api.post("/auth/login", { username, password });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: "Network error" };
    }
  },
  getUsers: async () => {
    try {
      const response = await api.get("/auth/users");
      return response.data;
    } catch (error) {
      //throw error.response ? error.response.data : { message: "Network error" };
      console.log(error);
      return "down";
    }
  },
};

// Courses API
export const coursesAPI = {
  getAllCourses: async () => {
    try {
      const response = await api.get("/allCourses/statistics");
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: "Network error" };
    }
  },
  getStudentCourses: async () => {
    try {
      const response = await api.get("/personalCourses/grades/mine");
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: "Network error" };
    }
  },
};

// Grade Upload API
export const gradeUploadAPI = {
  uploadInitialGrades: async (formData, config = {}) => {
    try {
      const response = await api.post(
        "/uploadGrades/postInitialGrades",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          ...config,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: "Network error" };
    }
  },
  uploadFinalGrades: async (formData, config = {}) => {
    try {
      const response = await api.post(
        "/uploadGrades/postFinalGrades",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          ...config,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: "Network error" };
    }
  },
};

// Review Requests API
export const reviewRequestsAPI = {
  getStudentReviewRequests: async () => {
    try {
      const response = await api.get("/reviewRequests/my-review-requests");
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: "Network error" };
    }
  },
  submitReviewRequest: async (requestData) => {
    try {
      const response = await api.post(
        "/reviewRequests/review-request",
        requestData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: "Network error" };
    }
  },
  getStudentCourses: async () => {
    try {
      const response = await api.get("/reviewRequests/my-courses");
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: "Network error" };
    }
  },
  getInstructorReviewRequests: async () => {
    try {
      const response = await api.get(
        "/manageReviewRequests/my-review-requests-instructor"
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: "Network error" };
    }
  },
  replyToReviewRequest: async (replyData) => {
    try {
      const response = await api.post(
        "/manageReviewRequests/reply-review-request",
        replyData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: "Network error" };
    }
  },
};

export default api;
