import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MyGrades from "./pages/student/MyGrades";
import ReviewRequest from "./pages/student/ReviewRequest";
import GradeUpload from "./pages/instructor/GradeUpload";
import ReviewManagement from "./pages/instructor/ReviewManagement";
import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Student Routes */}
          <Route path="/my-grades" element={<MyGrades />} />
          <Route path="/review-request" element={<ReviewRequest />} />

          {/* Instructor Routes */}
          <Route path="/grade-upload" element={<GradeUpload />} />
          <Route path="/review-management" element={<ReviewManagement />} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
