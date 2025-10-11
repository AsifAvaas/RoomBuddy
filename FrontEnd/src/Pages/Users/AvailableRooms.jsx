import React, { useState, useEffect } from "react";
import {
  Home,
  Users,
  DollarSign,
  Layers,
  AlertCircle,
  X,
  Calendar,
} from "lucide-react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { useNavigate } from "react-router-dom";

function AvailableRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingData, setBookingData] = useState({
    bedNo: "",
    move_in_date: "",
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const navigate = useNavigate();
  const backendurl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchAvailableRooms();
  }, []);

  const fetchAvailableRooms = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendurl}/api/getAvailableRooms`, {
        credentials: "include",
      });
      const data = await res.json();
      setRooms(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleBookRoom = (room) => {
    setSelectedRoom(room);
    setShowModal(true);
    setBookingData({ bedNo: "", move_in_date: "" });
    setBookingError(null);
    setBookingSuccess(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRoom(null);
    setBookingData({ bedNo: "", move_in_date: "" });
    setBookingError(null);
    setBookingSuccess(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingError(null);

    try {
      const response = await fetch(`${backendurl}/api/addTenant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          roomId: selectedRoom._id,
          bedNo: parseInt(bookingData.bedNo),
          move_in_date: bookingData.move_in_date,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Booking failed");
      }

      setBookingSuccess(true);
      setTimeout(() => {
        handleCloseModal();
        fetchAvailableRooms(); // Refresh rooms list
      }, 2000);
    } catch (err) {
      setBookingError(err.message || "Failed to book room");
    } finally {
      setBookingLoading(false);
    }
  };

  const getOccupancyColor = (type) => {
    switch (type.toLowerCase()) {
      case "single":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "double":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "triple":
        return "bg-green-100 text-green-700 border-green-200";
      case "shared":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-4 text-slate-600 font-medium">
            Loading available rooms...
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
            onClick={fetchAvailableRooms}
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
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-lg">
              <Home className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-800 mb-3">
              Available Rooms
            </h1>
            <p className="text-slate-600 text-lg">
              {rooms.length} {rooms.length === 1 ? "room" : "rooms"} currently
              available
            </p>
          </div>

          {rooms.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-slate-200">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-6">
                <Home className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                No Rooms Available
              </h3>
              <p className="text-slate-600">
                All rooms are currently occupied. Please check back later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div
                  key={room._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-indigo-300 group"
                >
                  {/* Room Header */}
                  <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 group-hover:from-indigo-700 group-hover:to-indigo-800 transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-3xl font-bold text-white mb-1">
                          Room {room.roomNumber}
                        </h2>
                        <p className="text-indigo-100 text-sm flex items-center gap-1">
                          <Layers className="w-4 h-4" />
                          Floor {room.floor}
                        </p>
                      </div>
                      <div
                        className={`px-4 py-2 rounded-full text-sm font-semibold border ${getOccupancyColor(
                          room.occupancy_type
                        )}`}
                      >
                        {room.occupancy_type}
                      </div>
                    </div>
                  </div>

                  {/* Room Details */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium">
                            Monthly Rent
                          </p>
                          <p className="text-2xl font-bold text-slate-800">
                            ${room.rent}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-5 h-5 text-blue-600" />
                          <p className="text-xs text-blue-700 font-semibold">
                            Capacity
                          </p>
                        </div>
                        <p className="text-2xl font-bold text-blue-900">
                          {room.capacity}
                        </p>
                      </div>

                      <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Home className="w-5 h-5 text-purple-600" />
                          <p className="text-xs text-purple-700 font-semibold">
                            Available
                          </p>
                        </div>
                        <p className="text-2xl font-bold text-purple-900">
                          {room.available_slots}
                        </p>
                      </div>
                    </div>

                    {/* Availability Bar */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-600">
                          Occupancy
                        </span>
                        <span className="text-xs font-bold text-slate-700">
                          {room.capacity - room.available_slots}/{room.capacity}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              ((room.capacity - room.available_slots) /
                                room.capacity) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* <button
                      onClick={() => handleBookRoom(room)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Book Room
                    </button> */}
                    <button
                      // onClick={() => alert("Hello")}
                      onClick={() => navigate(`/roomdetails/${room._id}`)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booking Modal */}
        {showModal && selectedRoom && (
          <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      Book Room {selectedRoom.roomNumber}
                    </h3>
                    <p className="text-indigo-100 text-sm mt-1">
                      Floor {selectedRoom.floor} • ${selectedRoom.rent}/month
                    </p>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmitBooking} className="p-6 space-y-4">
                {bookingSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-green-800">
                        Booking Successful!
                      </p>
                      <p className="text-sm text-green-600">
                        Confirmation email has been sent.
                      </p>
                    </div>
                  </div>
                )}

                {bookingError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-800">{bookingError}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Bed Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="bedNo"
                    value={bookingData.bedNo}
                    onChange={handleInputChange}
                    min="1"
                    max={selectedRoom.capacity}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder={`Enter bed number (1-${selectedRoom.capacity})`}
                    disabled={bookingLoading || bookingSuccess}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Choose a bed from 1 to {selectedRoom.capacity}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Move-in Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="move_in_date"
                    value={bookingData.move_in_date}
                    onChange={handleInputChange}
                    min={getTodayDate()}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    disabled={bookingLoading || bookingSuccess}
                  />
                </div>

                <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Monthly Rent:</span>
                    <span className="font-semibold text-slate-800">
                      ${selectedRoom.rent}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Available Beds:</span>
                    <span className="font-semibold text-slate-800">
                      {selectedRoom.available_slots}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                    disabled={bookingLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingLoading || bookingSuccess}
                    className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {bookingLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Booking...</span>
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default AvailableRooms;
