// components/AssignDriverModal.jsx - Improved version
import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

const AssignDriverModal = ({ isOpen, onClose, delivery, onAssign }) => {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [loading, setLoading] = useState(false);
  const [driversLoading, setDriversLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && delivery) {
      console.log('🎯 Modal opened with delivery:', delivery);
      fetchAvailableDrivers();
      setSelectedDriverId('');
      setError('');
    }
  }, [isOpen, delivery]);

  const fetchAvailableDrivers = async () => {
    try {
      setDriversLoading(true);
      console.log('🔍 Starting to fetch available drivers...');
      
      const response = await adminService.getAvailableDrivers();
      console.log('✅ Drivers fetch response:', response);
      
      if (response.success) {
        const driversData = response.drivers || response.data?.drivers || [];
        console.log('👥 Drivers data:', driversData);
        setDrivers(driversData);
        
        if (driversData.length === 0) {
          setError('No available drivers found. All drivers might be currently assigned.');
        }
      } else {
        const errorMsg = response.message || 'Failed to load available drivers';
        console.log('❌ Drivers fetch failed:', errorMsg);
        setError(errorMsg);
      }
    } catch (error) {
      console.error('💥 Error fetching drivers:', error);
      setError(`Failed to load drivers: ${error.message}`);
    } finally {
      setDriversLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedDriverId) {
      setError('Please select a driver');
      return;
    }

    try {
      setLoading(true);
      setError('');
      console.log('🚀 Starting assignment:', {
        deliveryId: delivery?.id,
        driverId: selectedDriverId
      });
      
      await onAssign(delivery.id, selectedDriverId);
      
      console.log('✅ Assignment successful');
      setSelectedDriverId('');
      onClose();
    } catch (error) {
      console.error('💥 Error in assignment:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to assign driver. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    console.log('🔒 Closing modal');
    setSelectedDriverId('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Assign Driver {delivery && `- Delivery #${delivery.tracking_number || delivery.id}`}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-semibold"
            disabled={loading}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Delivery Info */}
          {delivery && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Delivery Information</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Delivery ID:</strong> {delivery.tracking_number || delivery.id}</p>
                <p><strong>Status:</strong> 
                  <span className={`ml-1 font-medium ${
                    delivery.status === 'completed' ? 'text-green-600' : 
                    delivery.status === 'in_progress' ? 'text-blue-600' : 
                    'text-yellow-600'
                  }`}>
                    {delivery.status?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}
                  </span>
                </p>
                {delivery.pickup_address && (
                  <p><strong>Pickup:</strong> {delivery.pickup_address}</p>
                )}
                {delivery.dropoff_address && (
                  <p><strong>Dropoff:</strong> {delivery.dropoff_address}</p>
                )}
              </div>
            </div>
          )}

          {/* Driver Selection */}
          <div>
            <label htmlFor="driver-select" className="block text-sm font-medium text-gray-700 mb-2">
              Select Driver *
            </label>
            
            {driversLoading ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gold"></div>
                <span className="ml-2 text-gray-600">Loading drivers...</span>
              </div>
            ) : drivers.length === 0 ? (
              <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">No available drivers found.</p>
                <p className="text-yellow-600 text-sm mt-1">
                  All drivers might be currently assigned to other deliveries.
                </p>
              </div>
            ) : (
              <select
                id="driver-select"
                value={selectedDriverId}
                onChange={(e) => {
                  setSelectedDriverId(e.target.value);
                  setError('');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                disabled={loading}
              >
                <option value="">Choose a driver...</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.first_name} {driver.last_name} 
                    {driver.vehicle_type && ` - ${driver.vehicle_type}`}
                    {driver.license_plate && ` (${driver.license_plate})`}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm font-semibold">Error:</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={loading || !selectedDriverId || drivers.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-gold border border-transparent rounded-md hover:bg-gold/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Assigning...
              </span>
            ) : (
              'Assign Driver'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignDriverModal;