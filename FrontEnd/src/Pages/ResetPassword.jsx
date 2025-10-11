import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const backend = import.meta.env.VITE_BACKEND_URL;
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const email = searchParams.get("email");
  const navigate = useNavigate();
  // State for password inputs
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.put(`${backend}/api/password/reset`, {
        id,
        password,
      });
      if (response.data.errorMessage) {
        setError(response.data.errorMessage[0].msg);
      } else if (response.data.error) {
        setError(response.data.error);
      } else if (response.data.success) {
        navigate("/login");
      } else {
        setError("An unexpected error occured");
      }
    } catch (error) {
      setError("An unexpected error occured");
    }

    console.log("Password reset form submitted:", { id, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Reset Password
        </h1>
        <p className="text-center text-gray-600 mb-6">Email: {email}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500 text-white text-sm rounded-lg p-2 text-center">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white font-medium py-2 px-4 rounded-lg transition duration-300"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
