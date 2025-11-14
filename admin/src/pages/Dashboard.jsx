import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { adminService } from "../services/adminService";
import StatsCard from "../components/StatsCard";
import { useRealTime } from "../hooks/useRealTime";

const Dashboard = () => {
  const { realTimeData } = useRealTime();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    pendingDeliveries: 0,
    totalUsers: 0,
    todayDeliveries: 0,
  });
  const [loading, setLoading] = useState(true);

  // FIX: Add safe access to realTimeData
  useEffect(() => {
    if (realTimeData?.newDeliveries > 0) {
      setStats((prev) => ({
        ...prev,
        todayDeliveries: prev.todayDeliveries + realTimeData.newDeliveries,
        totalDeliveries: prev.totalDeliveries + realTimeData.newDeliveries,
      }));
    }
  }, [realTimeData?.newDeliveries]); // FIX: Use optional chaining

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDashboardStats();

      if (response.success) {
        // FIX: Handle both response formats
        // Format 1: {success: true, stats: {...}}
        // Format 2: {success: true, data: {stats: {...}}}

        const statsData = response.stats ||
          response.data?.stats || {
            totalDeliveries: 0,
            pendingDeliveries: 0,
            totalUsers: 0,
            todayDeliveries: 0,
          };

        setStats(statsData);
      } else {
        console.error("❌ API returned success: false", response);
      }
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* FIX: Add safe access for realTimeData */}
      {realTimeData?.newDeliveries > 0 && (
        <div className="bg-blue-100 border border-blue-300 text-blue-700 px-4 py-3 rounded">
          {realTimeData.newDeliveries} new delivery(s) since you logged in
        </div>
      )}

      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.firstName}</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="bg-gold text-black px-4 py-2 rounded-lg hover:bg-gold/70 text-sm font-semibold flex items-center space-x-2"
        >
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Deliveries"
          value={stats.totalDeliveries}
          change="+12%"
          trend="up"
          icon="📦"
          color="blue"
        />
        <StatsCard
          title="Pending Deliveries"
          value={stats.pendingDeliveries}
          change="+5%"
          trend="up"
          icon="⏳"
          color="yellow"
        />
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          change="+8%"
          trend="up"
          icon="👥"
          color="green"
        />
        <StatsCard
          title="Today's Deliveries"
          value={stats.todayDeliveries}
          change="+15%"
          trend="up"
          icon="🚚"
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-green-600 text-xl">➕</span>
              <span>Add New Driver</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-blue-600 text-xl">📊</span>
              <span>Generate Report</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-purple-600 text-xl">👥</span>
              <span>Manage Users</span>
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">API Status</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                Online
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Database</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                Connected
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Main Frontend</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                Running
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Updated</span>
              <span className="text-gray-900 text-sm">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity - FIX: Add safe access */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Real-time Activity</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {realTimeData?.userActivity?.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 text-sm">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.type === "new_delivery"
                      ? "bg-green-500"
                      : activity.type === "user_registered"
                      ? "bg-blue-500"
                      : "bg-orange-500"
                  }`}
                ></div>
                <span>
                  {activity.type === "new_delivery" &&
                    `New delivery #${activity.data?.tracking_number || "N/A"}`}
                  {activity.type === "user_registered" &&
                    `New user: ${activity.data?.email || "N/A"}`}
                </span>
                <span className="text-gray-400 text-xs">
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
            {!realTimeData?.userActivity ||
              (realTimeData.userActivity.length === 0 && (
                <p className="text-gray-500 text-sm">No recent activity</p>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
