import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Calendar,
  Home,
  CheckCircle,
  Clock,
  Filter,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

function Rents() {
  const [rentData, setRentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [paymentLoading, setPaymentLoading] = useState(null);

  const backendurl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchRentDetails();
  }, []);

  const fetchRentDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendurl}/api/rentDetails`, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch rent details");
      }

      if (data.success) {
        setRentData(data.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async (rentId) => {
    try {
      setPaymentLoading(rentId);

      const response = await fetch(
        `${backendurl}/api/onlinePayment/${rentId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to initiate payment");
      }

      if (data.success && data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      }
    } catch (err) {
      alert(`Payment Error: ${err.message}`);
      setPaymentLoading(null);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getAllRentRecords = () => {
    const allRecords = [];
    rentData.forEach((tenant) => {
      tenant.rentRecords.forEach((rent) => {
        allRecords.push(rent);
      });
    });
    return allRecords;
  };

  const getFilteredRecords = () => {
    const allRecords = getAllRentRecords();
    if (filter === "all") return allRecords;
    return allRecords.filter((rent) => rent.status === filter);
  };

  const getStatusColor = (status) => {
    return status === "paid"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  const getStatusIcon = (status) => {
    return status === "paid" ? (
      <CheckCircle className="w-4 h-4" />
    ) : (
      <Clock className="w-4 h-4" />
    );
  };

  const getTotalStats = () => {
    const allRecords = getAllRentRecords();
    const paid = allRecords.filter((r) => r.status === "paid").length;
    const pending = allRecords.filter((r) => r.status === "pending").length;
    const totalAmount = allRecords.reduce((sum, r) => sum + r.amount, 0);
    const paidAmount = allRecords
      .filter((r) => r.status === "paid")
      .reduce((sum, r) => sum + r.amount, 0);

    return { paid, pending, totalAmount, paidAmount, total: allRecords.length };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading rent details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-[500px] bg-gray-50">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <p className="text-red-800 font-medium">Error: {error}</p>
            <button
              onClick={fetchRentDetails}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const filteredRecords = getFilteredRecords();
  const stats = getTotalStats();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Rent History
            </h1>
            <p className="text-gray-600">
              Track and manage all your rent payments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Records</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Paid</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.paid}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.pending}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${stats.totalAmount}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 mb-6 border border-gray-200">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700 mr-2">
                Filter:
              </span>
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setFilter("paid")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === "paid"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Paid ({stats.paid})
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === "pending"
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Pending ({stats.pending})
              </button>
            </div>
          </div>

          {filteredRecords.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center border border-gray-200">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No rent records found</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredRecords.map((rent) => (
                <div
                  key={rent._id}
                  className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-md transition"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <Home className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Room {rent.tenantId.roomId.roomNumber} - Bed{" "}
                          {rent.tenantId.bedNo}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {rent.tenantId.roomId.occupancy_type} | Floor{" "}
                          {rent.tenantId.roomId.floor}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {getMonthName(rent.month)} {rent.year}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          ${rent.amount}
                        </p>
                        <p className="text-xs text-gray-500">
                          {rent.paymentMethod !== "none"
                            ? rent.paymentMethod
                            : "Not paid"}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getStatusColor(
                            rent.status
                          )}`}
                        >
                          {getStatusIcon(rent.status)}
                          <span className="font-medium capitalize">
                            {rent.status}
                          </span>
                        </div>

                        {rent.status === "pending" && (
                          <button
                            onClick={() => handlePayNow(rent._id)}
                            disabled={paymentLoading === rent._id}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
                          >
                            {paymentLoading === rent._id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Processing...</span>
                              </>
                            ) : (
                              <>
                                <CreditCard className="w-4 h-4" />
                                <span>Pay Now</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Move-in: {formatDate(rent.tenantId.move_in_date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        Due: {formatDate(rent.tenantId.next_due_date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Created: {formatDate(rent.createdAt)}</span>
                    </div>
                    {rent.status === "paid" && rent.PaymentId && (
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        <span>
                          Payment ID: {rent.PaymentId.slice(0, 20)}...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Rents;
