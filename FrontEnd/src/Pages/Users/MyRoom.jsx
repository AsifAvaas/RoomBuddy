import React, { useState, useEffect } from "react";
import {
  Home,
  MapPin,
  Users,
  DollarSign,
  Calendar,
  Bed,
  AlertCircle,
  Clock,
} from "lucide-react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

function MyRoom() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendurl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchMyRooms();
  }, []);

  const fetchMyRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendurl}/api/myRoom`, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch rooms");
      }

      setRooms(data.tenant);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch your rooms");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (isActive) => {
    return isActive
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-red-100 text-red-700 border-red-200";
  };

  const getOccupancyColor = (type) => {
    switch (type.toLowerCase()) {
      case "single":
        return "bg-purple-500";
      case "double":
        return "bg-blue-500";
      case "triple":
        return "bg-green-500";
      case "shared":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-4 text-slate-600 font-medium">
            Loading your rooms...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full border border-red-100">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 text-center mb-2">
            Error Loading Rooms
          </h3>
          <p className="text-slate-600 text-center mb-6">{error}</p>
          <button
            onClick={fetchMyRooms}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-lg">
                <Home className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-800">My Rooms</h1>
                <p className="text-slate-600 text-lg mt-1">
                  {rooms.length} {rooms.length === 1 ? "room" : "rooms"} booked
                </p>
              </div>
            </div>
          </div>

          {rooms.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-slate-200">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-6">
                <Home className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                No Rooms Booked
              </h3>
              <p className="text-slate-600 mb-6">
                You haven't booked any rooms yet. Browse available rooms to get
                started.
              </p>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-md hover:shadow-lg">
                View Available Rooms
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {rooms.map((tenant) => {
                const daysUntilDue = getDaysUntilDue(tenant.next_due_date);
                const isUrgent = daysUntilDue <= 7 && daysUntilDue >= 0;
                const isOverdue = daysUntilDue < 0;

                return (
                  <div
                    key={tenant._id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-indigo-300"
                  >
                    {/* Room Header with Color Strip */}
                    <div className="relative">
                      <div
                        className={`h-2 ${getOccupancyColor(
                          tenant.roomId.occupancy_type
                        )}`}
                      ></div>
                      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h2 className="text-3xl font-bold text-white mb-2">
                              Room {tenant.roomId.roomNumber}
                            </h2>
                            <div className="flex flex-wrap gap-2 ">
                              <span className="px-3 py-1 bg-white bg-opacity-20 text-black text-sm font-medium rounded-full flex items-center gap-1 ">
                                <MapPin className="w-3 h-3" />
                                Floor {tenant.roomId.floor}
                              </span>
                              <span className="px-3 py-1 bg-white bg-opacity-20 text-black text-sm font-medium rounded-full">
                                {tenant.roomId.occupancy_type}
                              </span>
                            </div>
                          </div>
                          <div
                            className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                              tenant.isActive
                            )}`}
                          >
                            {tenant.isActive ? "Active" : "Inactive"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Room Details */}
                    <div className="p-6 space-y-4">
                      {/* Rent and Bed Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <DollarSign className="w-4 h-4 text-green-600" />
                            </div>
                            <p className="text-xs text-green-700 font-semibold">
                              Monthly Rent
                            </p>
                          </div>
                          <p className="text-2xl font-bold text-green-900">
                            ${tenant.roomId.rent}
                          </p>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Bed className="w-4 h-4 text-blue-600" />
                            </div>
                            <p className="text-xs text-blue-700 font-semibold">
                              Your Bed
                            </p>
                          </div>
                          <p className="text-2xl font-bold text-blue-900">
                            Bed #{tenant.bedNo}
                          </p>
                        </div>
                      </div>

                      {/* Dates Section */}
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 font-medium">
                              Move-in Date
                            </p>
                            <p className="text-sm font-semibold text-slate-800">
                              {formatDate(tenant.move_in_date)}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`flex items-center gap-3 p-3 rounded-xl ${
                            isOverdue
                              ? "bg-red-50 border border-red-200"
                              : isUrgent
                              ? "bg-yellow-50 border border-yellow-200"
                              : "bg-slate-50"
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              isOverdue
                                ? "bg-red-100"
                                : isUrgent
                                ? "bg-yellow-100"
                                : "bg-purple-100"
                            }`}
                          >
                            <Clock
                              className={`w-5 h-5 ${
                                isOverdue
                                  ? "text-red-600"
                                  : isUrgent
                                  ? "text-yellow-600"
                                  : "text-purple-600"
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <p
                              className={`text-xs font-medium ${
                                isOverdue
                                  ? "text-red-600"
                                  : isUrgent
                                  ? "text-yellow-600"
                                  : "text-slate-500"
                              }`}
                            >
                              Next Due Date
                            </p>
                            <p
                              className={`text-sm font-semibold ${
                                isOverdue
                                  ? "text-red-800"
                                  : isUrgent
                                  ? "text-yellow-800"
                                  : "text-slate-800"
                              }`}
                            >
                              {formatDate(tenant.next_due_date)}
                            </p>
                          </div>
                          {(isUrgent || isOverdue) && (
                            <span
                              className={`px-3 py-1 text-xs font-bold rounded-full ${
                                isOverdue
                                  ? "bg-red-200 text-red-800"
                                  : "bg-yellow-200 text-yellow-800"
                              }`}
                            >
                              {isOverdue
                                ? "OVERDUE"
                                : `${daysUntilDue} days left`}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Room Occupancy */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Room Occupancy
                          </span>
                          <span className="text-xs font-bold text-slate-700">
                            {tenant.roomId.capacity -
                              tenant.roomId.available_slots}
                            /{tenant.roomId.capacity} occupied
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`${getOccupancyColor(
                              tenant.roomId.occupancy_type
                            )} h-full rounded-full transition-all duration-500`}
                            style={{
                              width: `${
                                ((tenant.roomId.capacity -
                                  tenant.roomId.available_slots) /
                                  tenant.roomId.capacity) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                        <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-md hover:shadow-lg">
                          View Details
                        </button>
                        <button className="px-4 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors">
                          Pay Rent
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MyRoom;
