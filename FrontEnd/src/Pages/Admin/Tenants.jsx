import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar";
import axios from "axios";
import {
  Trash2,
  Users,
  UserCheck,
  UserX,
  Phone,
  Mail,
  Home,
  Calendar,
} from "lucide-react";

function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const backendurl = import.meta.env.VITE_BACKEND_URL;

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendurl}/api/tenantDetails`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setTenants(res.data.data);
      } else {
        setError("No tenants found");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load tenants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleRemove = async (tenantId) => {
    if (!window.confirm("Are you sure you want to remove this tenant?")) return;

    try {
      const res = await axios.put(
        `${backendurl}/api/removeTenant/${tenantId}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setSuccess("Tenant removed successfully");
        fetchTenants();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError("Failed to remove tenant");
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      console.error(err);
      setError("Error removing tenant");
      setTimeout(() => setError(""), 3000);
    }
  };

  const getTenantStats = () => {
    const totalTenants = tenants.length;
    const activeTenants = tenants.filter((t) => t.isActive).length;
    const inactiveTenants = tenants.filter((t) => !t.isActive).length;

    return { totalTenants, activeTenants, inactiveTenants };
  };

  const stats = getTenantStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900">
              Tenant Management
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage all your tenants
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Total Tenants
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats.totalTenants}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Active Tenants
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats.activeTenants}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <UserCheck className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-gray-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Inactive Tenants
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats.inactiveTenants}
                  </p>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <UserX className="text-gray-600" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6 shadow-sm">
            <p className="font-medium">{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-lg mb-6 shadow-sm">
            <p className="font-medium">{success}</p>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading tenants...</p>
            </div>
          </div>
        ) : tenants.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Users className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Tenants Found
            </h3>
            <p className="text-gray-600">
              There are currently no tenants in the system.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Tenant
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Room Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Move-in Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tenants.map((tenant) => (
                    <tr
                      key={tenant._id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {tenant.userId?.profilePic ? (
                              <>
                                <img
                                  src={tenant.userId?.profilePic}
                                  alt=""
                                  className="w-12 h-12 rounded-full object-cover border-2 border-indigo-200 shadow-md"
                                />
                              </>
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                {tenant.userId?.username
                                  ?.charAt(0)
                                  .toUpperCase() || "T"}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="font-semibold text-gray-900">
                              {tenant.userId?.username || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail size={14} className="mr-2 text-gray-400" />
                            {tenant.userId?.email || "N/A"}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone size={14} className="mr-2 text-gray-400" />
                            {tenant.userId?.phone || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Home size={14} className="mr-2 text-gray-400" />
                            <span className="font-medium text-gray-900">
                              Room {tenant.roomId?.roomNumber || "N/A"}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 ml-6">
                            Bed #{tenant.bedNo}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-700">
                          <Calendar size={14} className="mr-2 text-gray-400" />
                          {new Date(tenant.move_in_date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {tenant.isActive ? (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          {tenant.isActive && (
                            <button
                              className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors duration-150"
                              onClick={() => handleRemove(tenant._id)}
                              title="Remove Tenant"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
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

export default Tenants;
