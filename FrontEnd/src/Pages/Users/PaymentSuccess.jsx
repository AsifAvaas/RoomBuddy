import React, { useEffect, useState } from "react";
import { CheckCircle, ArrowRight, Home, Loader } from "lucide-react";

function PaymentSuccess() {
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  const backendurl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    verifyPayment();
  }, []);

  const getQueryParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      sessionId: params.get("session_id"),
      rentId: params.get("rentId"),
    };
  };

  const verifyPayment = async () => {
    const { sessionId, rentId } = getQueryParams();

    if (!sessionId || !rentId) {
      setError("Missing payment information");
      setVerifying(false);
      return;
    }

    try {
      const response = await fetch(
        `${backendurl}/api/verifyPayment?session_id=${sessionId}&rentId=${rentId}`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to verify payment");
      }

      if (data.success) {
        setPaymentDetails(data.rent);
      } else {
        setError(data.message || "Payment verification failed");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setVerifying(false);
    }
  };

  const getMonthName = (month) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[month - 1];
  };

  const handleNavigate = (path) => {
    window.location.href = path;
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <Loader className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verifying Payment
          </h2>
          <p className="text-gray-600">
            Please wait while we confirm your payment...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-3xl">✕</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verification Failed
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => handleNavigate("/rents")}
            className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
          >
            Back to Rents
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            Your rent payment has been processed successfully
          </p>
        </div>

        {paymentDetails && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-600">Amount Paid</span>
              <span className="text-2xl font-bold text-green-600">
                ${paymentDetails.amount}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Period</span>
              <span className="font-medium text-gray-900">
                {getMonthName(paymentDetails.month)} {paymentDetails.year}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium text-gray-900 capitalize">
                {paymentDetails.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Paid
              </span>
            </div>
            {paymentDetails.PaymentId && (
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="text-gray-600">Transaction ID</span>
                <span className="text-xs text-gray-500 font-mono">
                  {paymentDetails.PaymentId.slice(0, 20)}...
                </span>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => handleNavigate("/rents")}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
          >
            <span>View All Rents</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleNavigate("/")}
            className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            <span>Go to Dashboard</span>
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          A receipt has been sent to your email
        </p>
      </div>
    </div>
  );
}

export default PaymentSuccess;
