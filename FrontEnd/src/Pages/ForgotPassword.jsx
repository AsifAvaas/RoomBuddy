import axios from "axios";
import React, { useState } from "react";
function ForgotPassword() {
  const [email, setEmail] = useState(""); // state for holding email
  const backend = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backend}/api/forgot-password`, {
        email,
      });
      if (data.success) {
        alert("Check your email to renew password");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="w-full h-screen flex justify-center items-center"
      style={{ backgroundColor: "rgb(222, 243, 231)" }}
    >
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <input
            type="email"
            value={email} // bind to state
            onChange={(e) => setEmail(e.target.value)} // update state
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          {/* Button */}
          <button
            type="submit"
            className="w-full border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white font-medium py-2 px-4 rounded-lg transition duration-300"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
