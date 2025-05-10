"use client";

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/useAuth";

const Navbar = () => {
  const { currentUser, logout, isStudent, isInstructor } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path ? "bg-indigo-700" : "";
  };

  return (
    <nav className="bg-indigo-600">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-white font-bold text-xl">Clear Sky</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/dashboard"
                  className={`text-white px-3 py-2 rounded-md text-sm font-medium ${isActive(
                    "/dashboard"
                  )}`}
                >
                  Dashboard
                </Link>

                {isStudent && (
                  <>
                    <Link
                      to="/my-grades"
                      className={`text-white px-3 py-2 rounded-md text-sm font-medium ${isActive(
                        "/my-grades"
                      )}`}
                    >
                      My Grades
                    </Link>
                    <Link
                      to="/review-request"
                      className={`text-white px-3 py-2 rounded-md text-sm font-medium ${isActive(
                        "/review-request"
                      )}`}
                    >
                      Review Requests
                    </Link>
                  </>
                )}

                {isInstructor && (
                  <>
                    <Link
                      to="/grade-upload"
                      className={`text-white px-3 py-2 rounded-md text-sm font-medium ${isActive(
                        "/grade-upload"
                      )}`}
                    >
                      Grade Upload
                    </Link>
                    <Link
                      to="/review-management"
                      className={`text-white px-3 py-2 rounded-md text-sm font-medium ${isActive(
                        "/review-management"
                      )}`}
                    >
                      Review Requests
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <div className="text-white mr-4">
                {currentUser?.firstName} {currentUser?.lastName}
              </div>
              <button
                onClick={handleLogout}
                className="bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-indigo-800"
              >
                Logout
              </button>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-indigo-700 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-indigo-800 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/dashboard"
              className={`text-white block px-3 py-2 rounded-md text-base font-medium ${isActive(
                "/dashboard"
              )}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>

            {isStudent && (
              <>
                <Link
                  to="/my-grades"
                  className={`text-white block px-3 py-2 rounded-md text-base font-medium ${isActive(
                    "/my-grades"
                  )}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Grades
                </Link>
                <Link
                  to="/review-request"
                  className={`text-white block px-3 py-2 rounded-md text-base font-medium ${isActive(
                    "/review-request"
                  )}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Review Requests
                </Link>
              </>
            )}

            {isInstructor && (
              <>
                <Link
                  to="/grade-upload"
                  className={`text-white block px-3 py-2 rounded-md text-base font-medium ${isActive(
                    "/grade-upload"
                  )}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Grade Upload
                </Link>
                <Link
                  to="/review-management"
                  className={`text-white block px-3 py-2 rounded-md text-base font-medium ${isActive(
                    "/review-management"
                  )}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Review Requests
                </Link>
              </>
            )}

            <div className="border-t border-indigo-700 pt-4 pb-3">
              <div className="px-3 text-white">
                {currentUser?.firstName} {currentUser?.lastName}
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="mt-2 block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-700 hover:bg-indigo-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
