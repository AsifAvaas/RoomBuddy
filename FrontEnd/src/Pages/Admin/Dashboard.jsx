import React, { useState, useEffect } from "react";
import {
  Home,
  Users,
  Bed,
  DollarSign,
  AlertCircle,
  UserX,
  TrendingUp,
  Calendar,
  RefreshCw,
  Activity,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    summary: null,
    occupancy: null,
    rentStats: null,
    roomBreakdown: null,
    pendingPayments: null,
    recentTenants: null,
  });

  const backendurl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const endpoints = [
        "summary",
        "occupancy",
        "rent-stats",
        "room-breakdown",
        "pending-payments",
        "recent-tenants",
      ];

      const requests = endpoints.map((endpoint) =>
        fetch(`${backendurl}/api/dashboard/${endpoint}`, {
          credentials: "include",
        }).then((res) => res.json())
      );

      const [
        summary,
        occupancy,
        rentStats,
        roomBreakdown,
        pendingPayments,
        recentTenants,
      ] = await Promise.all(requests);

      setDashboardData({
        summary,
        occupancy,
        rentStats,
        roomBreakdown,
        pendingPayments,
        recentTenants,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2 text-center">
            Error Loading Dashboard
          </h2>
          <p className="text-slate-600 text-center mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const {
    summary,
    occupancy,
    rentStats,
    roomBreakdown,
    pendingPayments,
    recentTenants,
  } = dashboardData;
  // console.log("Summery: ", summary);
  console.log("rentStats: ", rentStats);
  let totalPaid = 0;
  let totalPending = 0;

  rentStats.forEach((item) => {
    if (item._id.status === "paid") {
      totalPaid += item.totalAmount;
    } else if (item._id.status === "pending") {
      totalPending += item.totalAmount;
    }
  });
  // console.log("totalPaid: ", totalPaid);
  // console.log("totalPending: ", totalPending);
  const summaryCards = [
    {
      title: "Total Rooms",
      value: summary?.totalRooms || 0,
      icon: Home,
      color: "blue",
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      title: "Total Tenants",
      value: summary?.totalTenants || 0,
      icon: Users,
      color: "green",
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      textColor: "text-green-600",
    },
    {
      title: "Available Beds",
      value: summary?.totalAvailableBeds || 0,
      icon: Bed,
      color: "purple",
      bg: "bg-purple-50",
      iconBg: "bg-purple-100",
      textColor: "text-purple-600",
    },
    {
      title: "Rent Collected",
      value: `$${totalPaid?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: "emerald",
      bg: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      textColor: "text-emerald-600",
      subtitle: "This Month",
    },
    {
      title: "Pending Payments",
      value: `$${totalPending?.toLocaleString() || 0}`,
      icon: AlertCircle,
      color: "orange",
      bg: "bg-orange-50",
      iconBg: "bg-orange-100",
      textColor: "text-orange-600",
    },
    {
      title: "Recently Vacated",
      value: recentTenants?.recentlyVacated.length || 0,
      icon: UserX,
      color: "red",
      bg: "bg-red-50",
      iconBg: "bg-red-100",
      textColor: "text-red-600",
    },
  ];

  const occupancyData = occupancy
    ? [
        { name: "Occupied", value: occupancy.occupied, color: "#3b82f6" },
        { name: "Available", value: occupancy.available, color: "#b3b4b7" },
      ]
    : [];

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      overdue: "bg-red-100 text-red-800",
      paid: "bg-green-100 text-green-800",
    };
    return colors[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };
  // 🔹 Format rent data for monthly chart
  const formatRentData = (rentStats) => {
    if (!rentStats) return [];

    const grouped = {};

    rentStats.forEach((item) => {
      const { month, year, status } = item._id;
      const key = `${month}-${year}`;
      if (!grouped[key]) {
        grouped[key] = { month, year, paid: 0, pending: 0 };
      }
      grouped[key][status] = item.totalAmount;
    });

    return Object.values(grouped).map((item) => ({
      name: `${new Date(item.year, item.month - 1).toLocaleString("default", {
        month: "short",
      })} ${item.year}`,
      paid: item.paid || 0,
      pending: item.pending || 0,
    }));
  };

  // function RentChart({ rentStats }) {
  //   // Transform data for chart
  //   const monthlyData = useMemo(() => {
  //     const grouped = {};

  //     rentStats.forEach((item) => {
  //       const { month, year, status } = item._id;
  //       const key = `${month}-${year}`;
  //       if (!grouped[key]) {
  //         grouped[key] = { month, year, paid: 0, pending: 0 };
  //       }
  //       grouped[key][status] = item.totalAmount;
  //     });

  //     return Object.values(grouped).map((item) => ({
  //       name: `${new Date(item.year, item.month - 1).toLocaleString("default", {
  //         month: "short",
  //       })} ${item.year}`,
  //       paid: item.paid || 0,
  //       pending: item.pending || 0,
  //     }));
  //   }, [rentStats]);
  // }
  const monthlyData = formatRentData(rentStats);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
                <p className="text-slate-600 text-sm mt-1">
                  Welcome back! Here's your PG overview
                </p>
              </div>
              <button
                onClick={fetchDashboardData}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            {summaryCards.map((card, idx) => (
              <div
                key={idx}
                className={`${card.bg} rounded-xl p-5 shadow-sm hover:shadow-md transition`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`${card.iconBg} p-2 rounded-lg`}>
                    <card.icon className={`w-5 h-5 ${card.textColor}`} />
                  </div>
                </div>
                <h3 className="text-slate-600 text-xs font-medium mb-1">
                  {card.title}
                </h3>
                <p className={`text-2xl font-bold ${card.textColor}`}>
                  {card.value}
                </p>
                {card.subtitle && (
                  <p className="text-xs text-slate-500 mt-1">{card.subtitle}</p>
                )}
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Occupancy Pie Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Occupancy Overview
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={occupancyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {occupancyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Rent Bar Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Monthly Rent Collection
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="paid"
                    fill="#22c55e"
                    name="Paid Rent"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="pending"
                    fill="#ef4444"
                    name="Pending Rent"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Room Breakdown Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Home className="w-5 h-5 text-blue-600" />
                Room Occupancy Breakdown
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                      Floor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                      Room No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                      Capacity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                      Occupied
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                      Available
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                      Rent
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {roomBreakdown?.map((room, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 text-sm text-slate-900">
                        {room.floor}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {room.roomNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {room.type}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900">
                        {room.capacity}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900">
                        {room.occupied}
                      </td>
                      <td className="px-6 py-4 text-sm text-green-600 font-medium">
                        {room.available}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900">
                        ${room.rent}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Payments Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                Pending Payments
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                      Tenant Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                      Room
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                      Month
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {pendingPayments?.map((payment, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {payment.tenantId?.userId?.username}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {payment.tenantId?.roomId?.roomNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {payment.month}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                        ${payment.amount}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            payment.status
                          )}`}
                        >
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
