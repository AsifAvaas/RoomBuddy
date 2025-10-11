import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../Components/Navbar";

function Billing() {
  const [pendingRents, setPendingRents] = useState([]);
  const [filteredRents, setFilteredRents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, pending, paid
  const [markingPaid, setMarkingPaid] = useState(null);

  const backendurl = import.meta.env.VITE_BACKEND_URL;

  const fetchPendingRents = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${backendurl}/api/pendingRents`, {
        withCredentials: true,
      });

      const sortedData = res.data.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPendingRents(sortedData);
      setFilteredRents(sortedData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch pending rents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRents();
  }, []);

  useEffect(() => {
    if (filter === "all") {
      setFilteredRents(pendingRents);
    } else {
      setFilteredRents(pendingRents.filter((rent) => rent.status === filter));
    }
  }, [filter, pendingRents]);

  const handleMarkAsPaid = async (rentId) => {
    if (!window.confirm("Are you sure you want to mark this rent as paid?")) {
      return;
    }

    try {
      setMarkingPaid(rentId);
      const res = await axios.put(
        `${backendurl}/api/markRentPaid/${rentId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        // Update the local state with the updated rent
        setPendingRents((prevRents) =>
          prevRents.map((rent) =>
            rent._id === rentId
              ? {
                  ...rent,
                  status: "paid",
                  paymentMethod: "cash",
                  paymentDate: new Date(),
                }
              : rent
          )
        );
        alert("Rent marked as paid successfully!");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to mark rent as paid.");
    } finally {
      setMarkingPaid(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getFilterStats = () => {
    const total = pendingRents.length;
    const paid = pendingRents.filter((r) => r.status === "paid").length;
    const pending = pendingRents.filter((r) => r.status === "pending").length;
    return { total, paid, pending };
  };

  const stats = getFilterStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Billing & Rent Management
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Records</p>
            <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Paid</p>
            <p className="text-3xl font-bold text-green-600">{stats.paid}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">
              {stats.pending}
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-3">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "pending"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setFilter("paid")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "paid"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Paid ({stats.paid})
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading rent records...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {!loading && !error && filteredRents.length === 0 && (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <p className="text-gray-600">
              No rent records found for the selected filter.
            </p>
          </div>
        )}

        {!loading && filteredRents.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bed No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Month/Year
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Move In Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRents.map((rent) => (
                    <tr key={rent._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Bed #{rent.tenantId?.bedNo || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {rent.month}/{rent.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        ${rent.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                        {rent.paymentMethod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            rent.status
                          )}`}
                        >
                          {rent.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(rent.tenantId?.move_in_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {rent.paymentDate ? formatDate(rent.paymentDate) : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {rent.status === "pending" ? (
                          <button
                            onClick={() => handleMarkAsPaid(rent._id)}
                            disabled={markingPaid === rent._id}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                              markingPaid === rent._id
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                          >
                            {markingPaid === rent._id
                              ? "Processing..."
                              : "Mark as Paid"}
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Billing;
