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
    return <div className="text-center mt-10">Loading tenants...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-600">{error}</div>;

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto mt-8 p-4">
        {roomInfo && (
          <div className="bg-gray-50 p-4 rounded-lg shadow mb-6 flex gap-6 items-center">
            <div>
              <p className="text-gray-500 text-sm">Room Number</p>
              <p className="text-lg font-semibold">{roomInfo.roomNumber}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Occupancy Type</p>
              <p className="text-lg font-semibold">{roomInfo.occupancy_type}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Capacity</p>
              <p className="text-lg font-semibold">{roomInfo.capacity}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Available Slots</p>
              <p className="text-lg font-semibold">
                {roomInfo.available_slots}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Rent</p>
              <p className="text-lg font-semibold">${roomInfo.rent}</p>
            </div>
          </div>
        )}

        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Tenants in this room
        </h1>

        {tenants.length === 0 ? (
          <p className="text-gray-500 text-center">
            No tenants found in this room.
          </p>
        ) : (
          <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-200">
            <table className="w-full border-collapse bg-white text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                <tr>
                  <th className="p-3">Profile</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Bed No</th>
                  <th className="p-3">Move-in Date</th>
                  <th className="p-3">Next Due Date</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((tenant) => (
                  <tr
                    key={tenant._id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3">
                      <img
                        src={
                          tenant.userId?.profilePic ||
                          "https://via.placeholder.com/40x40?text=👤"
                        }
                        alt={tenant.userId?.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="p-3 font-medium text-gray-800">
                      {tenant.userId?.username || "N/A"}
                    </td>
                    <td className="p-3">{tenant.userId?.email || "N/A"}</td>
                    <td className="p-3">{tenant.userId?.phone || "N/A"}</td>
                    <td className="p-3">{tenant.bedNo}</td>
                    <td className="p-3">
                      {new Date(tenant.move_in_date).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {tenant.next_due_date
                        ? new Date(tenant.next_due_date).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          tenant.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
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
    </>
  );
}

export default RoomList;
