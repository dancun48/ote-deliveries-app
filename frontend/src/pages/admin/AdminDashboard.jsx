import React, { useState, useEffect } from 'react';
import { deliveryService } from '../../services/deliveryService';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    pendingDeliveries: 0,
    inTransitDeliveries: 0,
    deliveredDeliveries: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // In a real app, you'd have admin-specific endpoints
      const deliveriesResponse = await deliveryService.getAllDeliveries(1, 50);
      
      if (deliveriesResponse.success) {
        setDeliveries(deliveriesResponse.deliveries);
        calculateStats(deliveriesResponse.deliveries);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (deliveriesData) => {
    const totalDeliveries = deliveriesData.length;
    const pendingDeliveries = deliveriesData.filter(d => d.status === 'pending').length;
    const inTransitDeliveries = deliveriesData.filter(d => d.status === 'in_transit').length;
    const deliveredDeliveries = deliveriesData.filter(d => d.status === 'delivered').length;

    setStats({
      totalDeliveries,
      pendingDeliveries,
      inTransitDeliveries,
      deliveredDeliveries,
      totalUsers: new Set(deliveriesData.map(d => d.user_id)).size
    });
  };

  const handleStatusUpdate = async (deliveryId, newStatus) => {
    try {
      // In a real app, you'd call an admin endpoint to update delivery status
      console.log(`Updating delivery ${deliveryId} to status: ${newStatus}`);
      
      // Update local state for demo
      setDeliveries(prev => prev.map(delivery => 
        delivery.id === deliveryId 
          ? { ...delivery, status: newStatus }
          : delivery
      ));
      
      setShowUpdateModal(false);
      setSelectedDelivery(null);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error updating delivery status:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'PENDING' },
      assigned: { color: 'bg-blue-100 text-blue-800', text: 'ASSIGNED' },
      picked_up: { color: 'bg-purple-100 text-purple-800', text: 'PICKED UP' },
      in_transit: { color: 'bg-orange-100 text-orange-800', text: 'IN TRANSIT' },
      delivered: { color: 'bg-green-100 text-green-800', text: 'DELIVERED' },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'CANCELLED' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const StatusUpdateModal = () => {
    if (!selectedDelivery) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <h3 className="text-lg font-semibold mb-4">Update Delivery Status</h3>
          <p className="text-gray-600 mb-4">
            Update status for delivery: <strong>{selectedDelivery.tracking_number}</strong>
          </p>
          
          <div className="space-y-3">
            {['pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setUpdateStatus(status)}
                className={`w-full text-left p-3 rounded-lg border ${
                  updateStatus === status 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="capitalize">{status.replace('_', ' ')}</span>
                  {updateStatus === status && (
                    <span className="text-blue-500">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowUpdateModal(false)}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={() => handleStatusUpdate(selectedDelivery.id, updateStatus)}
              disabled={!updateStatus}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Update Status
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.firstName}</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {['overview', 'deliveries', 'users', 'drivers'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-2xl">📦</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Deliveries</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalDeliveries}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <span className="text-2xl">⏳</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingDeliveries}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <span className="text-2xl">🚚</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">In Transit</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.inTransitDeliveries}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Delivered</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.deliveredDeliveries}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Deliveries */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Recent Deliveries</h2>
              </div>
              <div className="p-6">
                {deliveries.slice(0, 5).map((delivery) => (
                  <div key={delivery.id} className="border border-gray-200 rounded-lg p-4 mb-4 last:mb-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{delivery.tracking_number}</h3>
                          {getStatusBadge(delivery.status)}
                        </div>
                        <p className="text-sm text-gray-600">
                          Customer: {delivery.first_name} {delivery.last_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Recipient: {delivery.recipient_name} • {delivery.recipient_phone}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedDelivery(delivery);
                          setUpdateStatus(delivery.status);
                          setShowUpdateModal(true);
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Deliveries Tab */}
        {activeTab === 'deliveries' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">All Deliveries</h2>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tracking #
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recipient
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {deliveries.map((delivery) => (
                      <tr key={delivery.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {delivery.tracking_number}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {delivery.first_name} {delivery.last_name}
                          <br />
                          <span className="text-xs text-gray-400">{delivery.email}</span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {delivery.recipient_name}
                          <br />
                          <span className="text-xs text-gray-400">{delivery.recipient_phone}</span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getStatusBadge(delivery.status)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(delivery.created_at)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedDelivery(delivery);
                              setUpdateStatus(delivery.status);
                              setShowUpdateModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Users Management</h2>
            </div>
            <div className="p-6">
              <div className="text-center py-8">
                <div className="text-gray-400 text-6xl mb-4">👥</div>
                <p className="text-gray-500 text-lg mb-2">Users Management</p>
                <p className="text-gray-400 text-sm">
                  User management features coming soon. Total users: {stats.totalUsers}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Drivers Tab */}
        {activeTab === 'drivers' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Drivers Management</h2>
            </div>
            <div className="p-6">
              <div className="text-center py-8">
                <div className="text-gray-400 text-6xl mb-4">🚗</div>
                <p className="text-gray-500 text-lg mb-2">Drivers Management</p>
                <p className="text-gray-400 text-sm">
                  Driver management features coming soon.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {showUpdateModal && <StatusUpdateModal />}
    </div>
  );
};

export default AdminDashboard;