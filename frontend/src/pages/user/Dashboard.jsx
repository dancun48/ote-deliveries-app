import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { deliveryService } from '../../services/deliveryService';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inTransit: 0,
    delivered: 0
  });

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const response = await deliveryService.getUserDeliveries();
      if (response.success) {
        setDeliveries(response.data.deliveries);
        calculateStats(response.data.deliveries);
      }
    } catch (error) {
      console.error('Error fetching deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (deliveriesData) => {
    setStats({
      total: deliveriesData.length,
      pending: deliveriesData.filter(d => d.status === 'pending').length,
      inTransit: deliveriesData.filter(d => d.status === 'in_transit').length,
      delivered: deliveriesData.filter(d => d.status === 'delivered').length
    });
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
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Welcome back, {user?.firstName} {user?.lastName}!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 text-center">
            <div className="text-xl sm:text-2xl font-bold text-black">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Deliveries</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 text-center">
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 text-center">
            <div className="text-xl sm:text-2xl font-bold text-orange-600">{stats.inTransit}</div>
            <div className="text-sm text-gray-600">In Transit</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 text-center">
            <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.delivered}</div>
            <div className="text-sm text-gray-600">Delivered</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 text-center sm:text-left">
                Quick Actions
              </h2>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
                <Link
                  to="/book-delivery"
                  className="flex-1 bg-black text-white text-center py-3 px-4 rounded-md hover:bg-gray-700 transition duration-200 font-medium text-sm"
                >
                  Book New Delivery
                </Link>
                <Link
                  to="/track"
                  className="flex-1 bg-yellow-500 text-white text-center py-3 px-4 rounded-md hover:bg-yellow-600 transition duration-200 font-medium text-sm"
                >
                  Track Delivery
                </Link>
                {user?.isAdmin && (
                  <a
                    href="https://oteadmin.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-purple-600 text-white text-center py-3 px-4 rounded-md hover:bg-purple-700 transition duration-200 font-medium text-sm"
                  >
                    ⚙️ Admin Panel
                  </a>
                )}
                <button
                  onClick={logout}
                  className="flex-1 bg-red-600 text-white text-center py-3 px-4 rounded-md hover:bg-red-700 transition duration-200 font-medium text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Recent Deliveries */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-center sm:text-left">
                  Recent Deliveries
                </h2>
              </div>
              <div className="p-4 sm:p-6">
                {loading ? (
                  <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : deliveries.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500 mb-2">No deliveries yet.</p>
                    <Link to="/book-delivery" className="text-blue-600 hover:text-blue-500 text-sm">
                      Book your first delivery!
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {deliveries.slice(0, 5).map((delivery) => (
                      <div
                        key={delivery.id}
                        className="border border-gray-200 rounded-lg p-4 sm:p-5"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                          <div className="flex-1 w-full">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                              <h3 className="font-semibold break-all text-sm sm:text-base">
                                {delivery.tracking_number}
                              </h3>
                              {getStatusBadge(delivery.status)}
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 truncate">
                              To: {delivery.recipient_name} • {delivery.recipient_phone}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600 truncate">
                              {delivery.delivery_address}
                            </p>
                          </div>
                          <Link
                            to={`/track?tracking=${delivery.tracking_number}`}
                            className="mt-3 sm:mt-0 bg-black hover:bg-gray-700 text-yellow-400 text-xs sm:text-sm py-2 px-3 rounded-lg font-medium"
                          >
                            Track
                          </Link>
                        </div>
                        <div className="flex flex-wrap justify-between items-center mt-3 text-xs sm:text-sm text-gray-500">
                          <span>Created: {formatDate(delivery.created_at)}</span>
                          {delivery.driver_name && (
                            <span>Driver: {delivery.driver_name}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
