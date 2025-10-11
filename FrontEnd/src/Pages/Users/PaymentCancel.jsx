import React from "react";
import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

function PaymentCancel() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 text-center max-w-md w-full">
        <div className="flex justify-center mb-4">
          <XCircle className="text-red-500" size={64} />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 mb-6">
          Your payment has been cancelled. You can try again later or explore
          other options below.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/rents"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Go to Rent Page
          </Link>
          <Link
            to="/"
            className="border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PaymentCancel;
