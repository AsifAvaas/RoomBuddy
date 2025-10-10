import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar";
import { useParams } from "react-router-dom";
import axios from "axios";

function RoomList() {
  const { roomId } = useParams();
  const [tenants, setTenants] = useState([]);
  const [roomInfo, setRoomInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/${roomId}/tenants`,
          { withCredentials: true }
        );
        if (res.data.success) {
          setTenants(res.data.tenants);
          if (res.data.tenants.length > 0) {
            setRoomInfo(res.data.tenants[0].roomId); // room info populated from backend
          }
        } else {
          setError("Failed to load tenants");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, [roomId]);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading tenants...</p>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
            <div className="text-red-500 text-5xl mb-4 text-center">⚠️</div>
            <p className="text-center text-red-600 font-semibold text-lg">
              {error}
            </p>
          </div>
        </div>
      </div>
    );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {roomInfo && (
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-indigo-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-3 shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Room Details
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 hover:shadow-md transition-shadow">
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1">
                    Room Number
                  </p>
                  <p className="text-2xl font-bold text-indigo-700">
                    {roomInfo.roomNumber}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100 hover:shadow-md transition-shadow">
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1">
                    Occupancy Type
                  </p>
                  <p className="text-2xl font-bold text-purple-700">
                    {roomInfo.occupancy_type}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 hover:shadow-md transition-shadow">
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1">
                    Capacity
                  </p>
                  <p className="text-2xl font-bold text-green-700">
                    {roomInfo.capacity}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100 hover:shadow-md transition-shadow">
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1">
                    Available Slots
                  </p>
                  <p className="text-2xl font-bold text-amber-700">
                    {roomInfo.available_slots}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-rose-50 to-red-50 rounded-xl p-4 border border-rose-100 hover:shadow-md transition-shadow">
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1">
                    Rent
                  </p>
                  <p className="text-2xl font-bold text-rose-700">
                    ${roomInfo.rent}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5">
              <div className="flex items-center gap-3">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <h1 className="text-2xl font-bold text-white">
                  Tenants in this room
                </h1>
              </div>
            </div>

            {tenants.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-gray-300 text-6xl mb-4">👥</div>
                <p className="text-gray-500 text-lg font-medium">
                  No tenants found in this room.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <th className="p-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Profile
                      </th>
                      <th className="p-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="p-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="p-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="p-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Bed No
                      </th>
                      <th className="p-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Move-in Date
                      </th>
                      <th className="p-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Next Due Date
                      </th>
                      <th className="p-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {tenants.map((tenant, index) => (
                      <tr
                        key={tenant._id}
                        className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200"
                      >
                        <td className="p-4">
                          <div className="relative">
                            <img
                              src={
                                tenant.userId?.profilePic ||
                                "https://via.placeholder.com/40x40?text=👤"
                              }
                              alt={tenant.userId?.username}
                              className="w-12 h-12 rounded-full object-cover border-2 border-indigo-200 shadow-md"
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white"></div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-gray-800">
                            {tenant.userId?.username || "N/A"}
                          </p>
                        </td>
                        <td className="p-4">
                          <p className="text-gray-600 text-sm">
                            {tenant.userId?.email || "N/A"}
                          </p>
                        </td>
                        <td className="p-4">
                          <p className="text-gray-600 text-sm">
                            {tenant.userId?.phone || "N/A"}
                          </p>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold rounded-lg shadow">
                            {tenant.bedNo}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="text-gray-700 text-sm font-medium">
                            {new Date(tenant.move_in_date).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="p-4">
                          <p className="text-gray-700 text-sm font-medium">
                            {tenant.next_due_date
                              ? new Date(
                                  tenant.next_due_date
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold shadow-md ${
                              tenant.isActive
                                ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                                : "bg-gradient-to-r from-red-400 to-rose-500 text-white"
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full mr-2 ${
                                tenant.isActive ? "bg-white" : "bg-white"
                              } animate-pulse`}
                            ></span>
                            {tenant.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default RoomList;
