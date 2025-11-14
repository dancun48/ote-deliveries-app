import React, { useState } from 'react';
import { deliveryService } from '../services/deliveryService';

const TrackDelivery = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setLoading(true);
    setError('');
    setDelivery(null);

    try {
      const response = await deliveryService.trackDelivery(trackingNumber.trim());
      
      if (response.success) {
        setDelivery(response.data.delivery);
      } else {
        setError(response.message || 'Delivery not found');
      }
    } catch (error) {
      console.error('Tracking error:', error);
      setError(error.response?.data?.message || 'Failed to track delivery. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusConfig = {
      pending: { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        text: 'PENDING',
        description: 'Your delivery is being processed',
        icon: '⏳'
      },
      assigned: { 
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        text: 'ASSIGNED',
        description: 'Driver assigned and preparing for pickup',
        icon: '👤'
      },
      picked_up: { 
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        text: 'PICKED UP',
        description: 'Package has been collected',
        icon: '📦'
      },
      in_transit: { 
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        text: 'IN TRANSIT',
        description: 'Package is on the way to destination',
        icon: '🚚'
      },
      delivered: { 
        color: 'bg-green-100 text-green-800 border-green-200',
        text: 'DELIVERED',
        description: 'Package has been delivered successfully',
        icon: '✅'
      },
      cancelled: { 
        color: 'bg-red-100 text-red-800 border-red-200',
        text: 'CANCELLED',
        description: 'Delivery was cancelled',
        icon: '❌'
      }
    };

    return statusConfig[status] || statusConfig.pending;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressSteps = (status) => {
    const steps = [
      { key: 'pending', label: 'Order Placed' },
      { key: 'assigned', label: 'Driver Assigned' },
      { key: 'picked', label: 'Picked Up' },
      { key: 'transit', label: 'In Transit' },
      { key: 'delivered', label: 'Delivered' }
    ];

    const currentIndex = steps.findIndex(step => step.key === status);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Delivery</h1>
          <p className="text-gray-600">
            Enter your tracking number to check the status of your delivery
          </p>
        </div>

        {/* Tracking Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <form onSubmit={handleTrack} className="mb-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number (e.g., TRK123456789)"
                  className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !trackingNumber.trim()}
                className="bg-gold text-black px-6 py-3 rounded-lg hover:bg-gold/70 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition duration-200"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Tracking...
                  </span>
                ) : (
                  'Track Delivery'
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Delivery Details */}
        {delivery && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Status Header */}
            <div className={`border-b ${getStatusInfo(delivery.status).color} p-6`}>
              <div className="flex items-center gap-4">
                <div className="text-3xl">
                  {getStatusInfo(delivery.status).icon}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    {getStatusInfo(delivery.status).text}
                  </h2>
                  <p className="text-sm opacity-90">
                    {getStatusInfo(delivery.status).description}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                {getProgressSteps(delivery.status).map((step, index) => (
                  <div key={step.key} className="flex flex-col items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.completed 
                        ? 'bg-gold text-white' 
                        : step.current
                        ? 'bg-gold text-white border-2 border-blue-600'
                        : 'bg-gold text-white'
                    }`}>
                      {step.completed ? '✓' : index + 1}
                    </div>
                    <span className={`text-xs mt-2 text-center ${
                      step.completed || step.current ? 'text-black font-medium' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Information */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sender/Recipient Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Delivery Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Tracking Number</p>
                      <p className="text-lg font-mono font-semibold text-gray-900">
                        {delivery.tracking_number}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 font-medium">Recipient</p>
                      <p className="text-gray-900">{delivery.recipient_name}</p>
                      <p className="text-gray-600">{delivery.recipient_phone}</p>
                    </div>

                    {delivery.driver_name && (
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Assigned Driver</p>
                        <p className="text-gray-900">{delivery.driver_name}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Route Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Pickup Address</p>
                      <p className="text-gray-900 whitespace-pre-line">{delivery.pickup_address}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 font-medium">Delivery Address</p>
                      <p className="text-gray-900 whitespace-pre-line">{delivery.delivery_address}</p>
                    </div>

                    {delivery.package_description && (
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Package Details</p>
                        <p className="text-gray-900">{delivery.package_description}</p>
                        {delivery.package_weight && (
                          <p className="text-gray-600 text-sm">
                            Weight: {delivery.package_weight} kg
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Delivery Timeline</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Order Created:</span>
                    <span className="text-gray-900">{formatDate(delivery.created_at)}</span>
                  </div>
                  {delivery.pickup_date && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Pickup Time:</span>
                      <span className="text-gray-900">{formatDate(delivery.pickup_date)}</span>
                    </div>
                  )}
                  {delivery.delivery_date && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Time:</span>
                      <span className="text-gray-900">{formatDate(delivery.delivery_date)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackDelivery;