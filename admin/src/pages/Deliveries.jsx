// pages/Deliveries.jsx - Updated with UUID handling
import React, { useState, useEffect } from "react";
import { adminService } from "../services/adminService";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { socketService } from "../services/socketService";

const Deliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchDeliveries();
  }, [pagination.page]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching deliveries...');
      
      const response = await adminService.getAllDeliveries(
        pagination.page,
        pagination.limit
      );

      console.log('📦 Deliveries fetch response:', response);

      if (response.success) {
        // Handle both response formats:
        const deliveriesData = response.deliveries || response.data?.deliveries || [];
        const paginationData = response.pagination || response.data?.pagination || {
          total: 0,
          totalPages: 0,
        };

        console.log(`✅ Found ${deliveriesData.length} deliveries`);
        setDeliveries(deliveriesData);
        setPagination((prev) => ({
          ...prev,
          total: paginationData.total,
          totalPages: paginationData.totalPages,
        }));
      } else {
        console.error("❌ API returned success: false", response);
        showNotification('error', 'Failed to load deliveries');
      }
    } catch (error) {
      console.error("❌ Error fetching deliveries:", error);
      showNotification('error', 'Failed to load deliveries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Listen for real-time delivery updates
    socketService.on("delivery_created", (newDelivery) => {
      console.log('📦 New delivery via socket:', newDelivery);
      setDeliveries((prev) => [newDelivery, ...prev]);

      // Update pagination totals
      setPagination((prev) => ({
        ...prev,
        total: prev.total + 1,
      }));
    });

    socketService.on("delivery_status_updated", (updatedDelivery) => {
      console.log('📦 Delivery status updated via socket:', updatedDelivery);
      setDeliveries((prev) =>
        prev.map((delivery) =>
          delivery.id === updatedDelivery.id ? updatedDelivery : delivery
        )
      );
    });

    socketService.on("driver_assigned", (updatedDelivery) => {
      console.log('🚗 Driver assigned via socket:', updatedDelivery);
      setDeliveries((prev) =>
        prev.map((delivery) =>
          delivery.id === updatedDelivery.id ? updatedDelivery : delivery
        )
      );
    });

    return () => {
      socketService.socket?.off("delivery_created");
      socketService.socket?.off("delivery_status_updated");
      socketService.socket?.off("driver_assigned");
    };
  }, []);

  const handleStatusUpdate = async (deliveryId, newStatus) => {
    try {
      console.log('🔄 Updating status:', { deliveryId, newStatus });
      setUpdatingStatus(prev => ({ ...prev, [deliveryId]: true }));
      
      await adminService.updateDeliveryStatus(deliveryId, newStatus);
      
      // Update local state immediately for better UX
      setDeliveries(prev => 
        prev.map(delivery => 
          delivery.id === deliveryId 
            ? { ...delivery, status: newStatus }
            : delivery
        )
      );
      
      showNotification('success', `Delivery status updated to ${newStatus}`);
    } catch (error) {
      console.error("❌ Error updating delivery status:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update delivery status';
      showNotification('error', errorMessage);
      
      // Revert the local state change if the API call failed
      fetchDeliveries(); // Refresh to get correct data
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [deliveryId]: false }));
    }
  };

  const statusOptions = [
    { value: "pending", label: "🟡 Pending" },
    { value: "assigned", label: "🔵 Assigned" },
    { value: "picked_up", label: "🟠 Picked Up" },
    { value: "in_transit", label: "🚚 In Transit" },
    { value: "delivered", label: "✅ Delivered" },
    { value: "cancelled", label: "❌ Cancelled" }
  ];

  const columns = [
    {
      key: "tracking_number",
      title: "Tracking #",
      render: (value) => (
        <span className="font-mono font-semibold text-sm">{value || 'N/A'}</span>
      ),
    },
    {
      key: "customer",
      title: "Customer",
      render: (_, row) => (
        <div>
          <div className="font-medium">{row.first_name} {row.last_name}</div>
          {row.email && <div className="text-xs text-gray-500">{row.email}</div>}
        </div>
      ),
    },
    {
      key: "recipient_name",
      title: "Recipient",
      render: (value) => value || '-',
    },
    {
      key: "recipient_phone",
      title: "Phone",
      render: (value) => value || '-',
    },
    {
      key: "status",
      title: "Status",
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <select
            value={value}
            onChange={(e) => handleStatusUpdate(row.id, e.target.value)}
            disabled={updatingStatus[row.id]}
            className={`text-xs font-medium px-3 py-1 rounded-full border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[140px] ${
              updatingStatus[row.id] ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'
            } ${
              value === "pending" ? "bg-yellow-100 text-yellow-800" :
              value === "assigned" ? "bg-blue-100 text-blue-800" :
              value === "picked_up" ? "bg-orange-100 text-orange-800" :
              value === "in_transit" ? "bg-purple-100 text-purple-800" :
              value === "delivered" ? "bg-green-100 text-green-800" :
              value === "cancelled" ? "bg-red-100 text-red-800" :
              "bg-gray-100 text-gray-800"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {updatingStatus[row.id] && (
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
          )}
        </div>
      ),
    },
    {
      key: "created_at",
      title: "Created",
      render: (value) => value ? new Date(value).toLocaleDateString() : '-',
    },
  ];

  const actions = [
  {
    label: "View Details",
    onClick: (row) => {
      console.log("View delivery:", row.id);
    },
    variant: "primary"
  },
  {
    label: "Assign Driver",
    onClick: (row) => {
      console.log("Assign driver to:", row.id);
    },
    show: (row) => row.status === 'pending',
    variant: "primary"
  }
];

  return (
    <div className="space-y-6">
      {/* Notification Banner */}
      {notification && (
        <div className={`p-4 rounded-lg ${
          notification.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <div className="flex justify-between items-center">
            <span>{notification.message}</span>
            <button 
              onClick={() => setNotification(null)}
              className="text-lg font-semibold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Deliveries Management
          </h1>
          <p className="text-gray-600">Manage all delivery orders</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchDeliveries}
            disabled={loading}
            className="bg-gold text-black px-4 py-2 rounded-lg hover:bg-gold/70 disabled:opacity-50 flex items-center space-x-2 text-sm font-semibold"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                <span>Loading...</span>
              </>
            ) : (
              <>
                <span>↻</span>
                <span>Refresh</span>
              </>
            )}
          </button>
          <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-black/70 text-sm font-semibold">
            Export Data
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">Total Deliveries</div>
          <div className="text-2xl font-bold text-gray-900">
            {pagination.total}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">
            {deliveries.filter((d) => d.status === "pending").length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">In Transit</div>
          <div className="text-2xl font-bold text-orange-600">
            {deliveries.filter((d) => d.status === "in_transit").length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">Delivered</div>
          <div className="text-2xl font-bold text-green-600">
            {deliveries.filter((d) => d.status === "delivered").length}
          </div>
        </div>
      </div>

      {/* Deliveries Table */}
      <DataTable
        columns={columns}
        data={deliveries}
        actions={actions}
        loading={loading}
        onRowClick={(row) => console.log("Row clicked:", row)}
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Showing page {pagination.page} of {pagination.totalPages} • {pagination.total} total deliveries
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              disabled={pagination.page === 1}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deliveries;