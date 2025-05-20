import { useState, useEffect } from "react";
import { AuthContext } from "./useAuth";
import { authAPI } from "../services/api";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is stored in localStorage
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      setError(null);
      const response = await authAPI.login(username, password);

      if (response.success) {
        const { token, user } = response;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setCurrentUser(user);
        return { success: true };
      } else {
        setError(response.message || "Login failed");
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error.message || "Login failed";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    logout,
    error,
    isAuthenticated: !!currentUser,
    isStudent: currentUser?.role === "student",
    isInstructor: currentUser?.role === "instructor",
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
