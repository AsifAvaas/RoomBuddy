import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Navbar from "../../Components/Navbar";
import { AuthContext } from "../../Components/AuthContext";
import {
  Plus,
  Edit,
  Trash2,
  Building2,
  Users,
  DollarSign,
  Image,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Rooms() {
  const { user } = useContext(AuthContext);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    roomNumber: "",
    floor: "",
    occupancy_type: "Single",
    rent: "",
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const backendurl = import.meta.env.VITE_BACKEND_URL;

  // Fetch all rooms
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendurl}/api/getAllRooms`, {
        withCredentials: true,
      });
      setRooms(res.data);
    } catch (err) {
      setError("Failed to fetch rooms.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const data = new FormData();
      data.append("roomNumber", formData.roomNumber);
      data.append("floor", formData.floor);
      data.append("occupancy_type", formData.occupancy_type);
      data.append("rent", formData.rent);

      images.forEach((file) => data.append("images", file)); // append multiple

      if (editingRoom) {
        await axios.put(`${backendurl}/api/editRoom/${editingRoom._id}`, data, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess("Room updated successfully!");
      } else {
        await axios.post(`${backendurl}/api/addRoom`, data, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess("Room added successfully!");
      }

      setShowModal(false);
      fetchRooms();
      setFormData({
        roomNumber: "",
        floor: "",
        occupancy_type: "Single",
        rent: "",
      });
      setImages([]);
      setImagePreviews([]);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save room.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      await axios.delete(`${backendurl}/api/deleteRoom/${id}`, {
        withCredentials: true,
      });
      setSuccess("Room deleted successfully!");
      fetchRooms();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete room.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const openModal = (room = null, e = null) => {
    if (e) e.stopPropagation();
    setEditingRoom(room);
    if (room) {
      setFormData({
        roomNumber: room.roomNumber,
        floor: room.floor,
        occupancy_type: room.occupancy_type,
        rent: room.rent,
      });
    } else {
      setFormData({
        roomNumber: "",
        floor: "",
        occupancy_type: "Single",
        rent: "",
      });
    }
    setImages([]);
    setImagePreviews([]);
    setShowModal(true);
  };

  const getRoomStats = () => {
    const totalRooms = rooms.length;
    const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);
    const totalAvailable = rooms.reduce(
      (sum, room) => sum + room.available_slots,
      0
    );
    const occupancyRate =
      totalCapacity > 0
        ? (((totalCapacity - totalAvailable) / totalCapacity) * 100).toFixed(1)
        : 0;

    return { totalRooms, totalCapacity, totalAvailable, occupancyRate };
  };

  const stats = getRoomStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Room Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your hostel rooms and availability
              </p>
            </div>
            <button
              onClick={() => openModal()}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <Plus size={20} /> Add Room
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              title="Total Rooms"
              value={stats.totalRooms}
              color="blue"
              icon={<Building2 className="text-blue-600" size={24} />}
            />
            <StatCard
              title="Total Capacity"
              value={stats.totalCapacity}
              color="purple"
              icon={<Users className="text-purple-600" size={24} />}
            />
            <StatCard
              title="Available Slots"
              value={stats.totalAvailable}
              color="green"
              icon={<Users className="text-green-600" size={24} />}
            />
            <StatCard
              title="Occupancy Rate"
              value={`${stats.occupancyRate}%`}
              color="orange"
              icon={<DollarSign className="text-orange-600" size={24} />}
            />
          </div>
        </div>

        {/* Alerts */}
        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        {/* Table */}
        {loading ? (
          <Loader />
        ) : (
          <RoomTable
            rooms={rooms}
            navigate={navigate}
            openModal={openModal}
            handleDelete={handleDelete}
          />
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-5 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white">
                {editingRoom ? "Edit Room" : "Add New Room"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="p-6 space-y-4">
                <FormInput
                  label="Room Number"
                  name="roomNumber"
                  type="text"
                  value={formData.roomNumber}
                  placeholder="e.g., 101"
                  onChange={handleChange}
                />
                <FormInput
                  label="Floor"
                  name="floor"
                  type="number"
                  value={formData.floor}
                  placeholder="e.g., 1"
                  onChange={handleChange}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Occupancy Type
                  </label>
                  <select
                    name="occupancy_type"
                    value={formData.occupancy_type}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <option value="Single">Single</option>
                    <option value="Triple">Triple</option>
                    <option value="Shared">Shared</option>
                  </select>
                </div>
                <FormInput
                  label="Rent ($)"
                  name="rent"
                  type="number"
                  value={formData.rent}
                  placeholder="e.g., 500"
                  onChange={handleChange}
                />

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Image size={18} /> Upload Room Pictures
                  </label>
                  <input
                    type="file"
                    name="images"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                  {imagePreviews.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {imagePreviews.map((src, idx) => (
                        <img
                          key={idx}
                          src={src}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors duration-150"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Saving..."
                    : editingRoom
                    ? "Save Changes"
                    : "Add Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper components
const StatCard = ({ title, value, color, icon }) => (
  <div
    className={`bg-white rounded-xl shadow-md p-6 border-l-4 border-${color}-500`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`bg-${color}-100 p-3 rounded-lg`}>{icon}</div>
    </div>
  </div>
);

const Alert = ({ type, message }) => (
  <div
    className={`${
      type === "error"
        ? "bg-red-50 border-l-4 border-red-500 text-red-700"
        : "bg-green-50 border-l-4 border-green-500 text-green-700"
    } px-6 py-4 rounded-lg mb-6 shadow-sm`}
  >
    <p className="font-medium">{message}</p>
  </div>
);

const FormInput = ({ label, name, type, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
    />
  </div>
);

const Loader = () => (
  <div className="flex justify-center items-center py-16">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading rooms...</p>
    </div>
  </div>
);

const RoomTable = ({ rooms, navigate, openModal, handleDelete }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Room No.
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Floor
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Occupancy
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Capacity
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Available
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Rent
            </th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rooms.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                <Building2 className="mx-auto mb-3 text-gray-400" size={48} />
                <p className="text-lg font-medium">No rooms found</p>
                <p className="text-sm">
                  Click "Add Room" to create your first room
                </p>
              </td>
            </tr>
          ) : (
            rooms.map((room) => (
              <tr
                key={room._id}
                className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                onClick={() => navigate(`/rooms/${room._id}`)}
              >
                <td className="px-6 py-4 font-semibold text-gray-900">
                  {room.roomNumber}
                </td>
                <td className="px-6 py-4 text-gray-700">{room.floor}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {room.occupancy_type}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700">{room.capacity}</td>
                <td className="px-6 py-4">
                  <span
                    className={`font-medium ${
                      room.available_slots > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {room.available_slots}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900">
                  ${room.rent}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-colors duration-150"
                      onClick={(e) => openModal(room, e)}
                      title="Edit Room"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors duration-150"
                      onClick={(e) => handleDelete(room._id, e)}
                      title="Delete Room"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default Rooms;
