import { useContext, useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import axios from "axios";

export default function Navbar() {
  const { isLoggedIn, isAdmin, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const backendurl = import.meta.env.VITE_BACKEND_URL;

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${backendurl}/api/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        logout();
        setIsMobileMenuOpen(false);
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleLogin = () => {
    navigate("/login");

    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-bold text-blue-600">
              RoomBuddy
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {isLoggedIn ? (
              <>
                {isAdmin ? (
                  <>
                    <a
                      href="/admin-dashboard"
                      className={`px-3 py-2 text-sm font-medium ${
                        currentPath === "/admin-dashboard"
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-700 hover:text-blue-600"
                      }`}
                    >
                      Dashboard
                    </a>
                    <a
                      href="/rooms"
                      className={`px-3 py-2 text-sm font-medium ${
                        currentPath === "/rooms"
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-700 hover:text-blue-600"
                      }`}
                    >
                      Rooms
                    </a>
                    <a
                      href="/tenants"
                      className={`px-3 py-2 text-sm font-medium ${
                        currentPath === "/tenants"
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-700 hover:text-blue-600"
                      }`}
                    >
                      Tenants
                    </a>
                    <a
                      href="/billing"
                      className={`px-3 py-2 text-sm font-medium ${
                        currentPath === "/billing"
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-700 hover:text-blue-600"
                      }`}
                    >
                      Billing
                    </a>
                  </>
                ) : (
                  <>
                    <a
                      href="/"
                      className={`px-3 py-2 text-sm font-medium ${
                        currentPath === "/"
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-700 hover:text-blue-600"
                      }`}
                    >
                      Home
                    </a>
                    <a
                      href="/available-rooms"
                      className={`px-3 py-2 text-sm font-medium ${
                        currentPath === "/available-rooms"
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-700 hover:text-blue-600"
                      }`}
                    >
                      Available Rooms
                    </a>
                    <a
                      href="/my-room"
                      className={`px-3 py-2 text-sm font-medium ${
                        currentPath === "/my-room"
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-700 hover:text-blue-600"
                      }`}
                    >
                      My Room
                    </a>
                    <a
                      href="/rents"
                      className={`px-3 py-2 text-sm font-medium ${
                        currentPath === "/rents"
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-700 hover:text-blue-600"
                      }`}
                    >
                      Rents
                    </a>
                  </>
                )}
                <a
                  href="/profile"
                  className={`px-3 py-2 text-sm font-medium ${
                    currentPath === "/profile"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  Profile
                </a>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className={`px-3 py-2 text-sm font-medium ${
                    currentPath === "/login"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  Login
                </button>
                <a
                  href="/signup"
                  className={`px-4 py-2 rounded text-sm font-medium ${
                    currentPath === "/signup"
                      ? "bg-blue-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  Sign Up
                </a>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isLoggedIn ? (
              <>
                <a
                  href="/"
                  className={`block px-3 py-2 rounded text-base font-medium ${
                    currentPath === "/"
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </a>
                <a
                  href="/available-rooms"
                  className={`block px-3 py-2 rounded text-base font-medium ${
                    currentPath === "/available-rooms"
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Available Rooms
                </a>
                <a
                  href="/my-room"
                  className={`block px-3 py-2 rounded text-base font-medium ${
                    currentPath === "/my-room"
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Room
                </a>
                <a
                  href="/rents"
                  className={`block px-3 py-2 rounded text-base font-medium ${
                    currentPath === "/rents"
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Rents
                </a>
                <a
                  href="/profile"
                  className={`block px-3 py-2 rounded text-base font-medium ${
                    currentPath === "/rents"
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </a>
                <button
                  onClick={handleLogout}
                  className="w-full text-left bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-base font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className={`w-full text-left px-3 py-2 rounded text-base font-medium ${
                    currentPath === "/login"
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                  }`}
                >
                  Login
                </button>
                <a
                  href="/signup"
                  className={`block px-3 py-2 rounded text-base font-medium text-center ${
                    currentPath === "/signup"
                      ? "bg-blue-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
