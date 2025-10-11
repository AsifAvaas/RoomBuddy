import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  DollarSign,
  Home,
  Bed,
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  Info,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X, // ✅ FIX: Added missing X icon
} from "lucide-react";

function Roomdetails() {
  const { id } = useParams();
  const roomId = id;
  const navigate = useNavigate();

  const backendurl = import.meta.env.VITE_BACKEND_URL;

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Booking states
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingData, setBookingData] = useState({
    bedNo: "",
    move_in_date: "",
  });

  useEffect(() => {
    fetchRoomDetails();
  }, [roomId]);

  const fetchRoomDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendurl}/api/room/${roomId}`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch room details");

      const data = await res.json();
      if (data.success) setRoom(data.room);
      else throw new Error("Room not found");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBookRoom = () => {
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

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    try {
      setBookingLoading(true);
      setBookingError(null);
      setBookingSuccess(false);

      const res = await fetch(`${backendurl}/api/addTenant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          roomId: selectedRoom._id,
          bedNo: bookingData.bedNo,
          move_in_date: bookingData.move_in_date,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Booking failed");

      setBookingSuccess(true);
      navigate("/my-room");
      //   await fetchRoomDetails();
    } catch (err) {
      setBookingError(err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  const nextImage = () => {
    if (room?.images) {
      setCurrentImageIndex((prev) =>
        prev === room.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (room?.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? room.images.length - 1 : prev - 1
      );
    }
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading room details...</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Error</h2>
          <p className="text-slate-600 mb-6">{error || "Room not found"}</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isAvailable = room.available_slots > 0;
  const occupiedSlots = room.capacity - room.available_slots;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition mb-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Room {room.roomNumber}
              </h1>
              <p className="text-slate-600 mt-1">
                Floor {room.floor} • {room.occupancy_type}
              </p>
            </div>
            <div
              className={`px-4 py-2 rounded-full font-semibold ${
                isAvailable
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isAvailable ? "Available" : "Fully Occupied"}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Carousel */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative aspect-video bg-slate-900">
                {room.images?.length ? (
                  <>
                    <img
                      src={room.images[currentImageIndex]}
                      alt={`Room ${room.roomNumber}`}
                      className="w-full h-full object-cover"
                    />
                    {room.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                        <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                          {currentImageIndex + 1} / {room.images.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    <Home className="w-16 h-16" />
                    <p>No images available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Room Description */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                About This Room
              </h2>
              <p className="text-slate-600 leading-relaxed">
                This {room.occupancy_type.toLowerCase()} occupancy room is
                located on floor {room.floor}. It can accommodate up to{" "}
                {room.capacity} {room.capacity === 1 ? "person" : "people"} and
                offers all essential amenities for a comfortable stay.
              </p>
              {isAvailable && (
                <p className="text-green-700 font-medium mt-4">
                  {room.available_slots}{" "}
                  {room.available_slots === 1 ? "slot" : "slots"} available for
                  booking.
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Booking */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">
                Quick Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between bg-blue-50 p-3 rounded-lg">
                  <span>Monthly Rent</span>
                  <span className="font-bold">${room.rent}</span>
                </div>
                <div className="flex justify-between bg-purple-50 p-3 rounded-lg">
                  <span>Capacity</span>
                  <span className="font-bold">{room.capacity}</span>
                </div>
                <div className="flex justify-between bg-green-50 p-3 rounded-lg">
                  <span>Available</span>
                  <span className="font-bold">{room.available_slots}</span>
                </div>
              </div>
            </div>

            <button
              disabled={!isAvailable}
              onClick={handleBookRoom}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                isAvailable
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed"
              }`}
            >
              {isAvailable ? "Book This Room" : "Fully Occupied"}
            </button>
          </div>
        </div>

        {/* Booking Modal */}
        {showModal && selectedRoom && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
              {/* Header */}
              <div className="bg-indigo-600 p-6 flex justify-between items-center">
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
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmitBooking} className="p-6 space-y-4">
                {bookingSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-800 font-semibold">
                    ✅ Booking Successful!
                  </div>
                )}
                {bookingError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-2 text-red-800">
                    <AlertCircle className="w-5 h-5" />
                    {bookingError}
                  </div>
                )}

                <div>
                  <label className="block mb-2 font-medium">Bed Number</label>
                  <input
                    type="number"
                    name="bedNo"
                    value={bookingData.bedNo}
                    onChange={handleInputChange}
                    min="1"
                    max={selectedRoom.capacity}
                    required
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Move-in Date
                  </label>
                  <input
                    type="date"
                    name="move_in_date"
                    value={bookingData.move_in_date}
                    onChange={handleInputChange}
                    min={getTodayDate()}
                    required
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 border border-slate-300 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingLoading || bookingSuccess}
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {bookingLoading ? "Booking..." : "Confirm"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Roomdetails;
