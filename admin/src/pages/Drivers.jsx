import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService'; // ADD THIS IMPORT
import DataTable from '../components/DataTable';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: '',
    email: '',
    phone: '',
    vehicle_type: '',
    license_plate: ''
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllDrivers();
      
      console.log('🚗 Drivers response:', response);

      if (response.success) {
        // Handle both response formats
        const driversData = response.drivers || response.data?.drivers || [];
        setDrivers(driversData);
      } else {
        console.error('❌ API returned success: false', response);
      }
    } catch (error) {
      console.error('❌ Error fetching drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDriver = async () => {
    try {
      const response = await adminService.createDriver(newDriver);
      
      if (response.success) {
        setDrivers(prev => [response.driver, ...prev]);
        setShowAddModal(false);
        setNewDriver({
          name: '',
          email: '',
          phone: '',
          vehicle_type: '',
          license_plate: ''
        });
        alert('Driver added successfully!');
      } else {
        alert(response.message || 'Error adding driver');
      }
    } catch (error) {
      console.error('❌ Error adding driver:', error);
      alert(error.response?.data?.message || 'Error adding driver. Please try again.');
    }
  };

  const handleToggleStatus = async (driverId, currentStatus) => {
    try {
      const response = await adminService.updateDriverStatus(driverId, !currentStatus);
      
      if (response.success) {
        setDrivers(prev => 
          prev.map(driver => 
            driver.id === driverId 
              ? { ...driver, is_active: !currentStatus }
              : driver
          )
        );
        alert(`Driver ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      } else {
        alert(response.message || 'Error updating driver status');
      }
    } catch (error) {
      console.error('❌ Error updating driver status:', error);
      alert(error.response?.data?.message || 'Error updating driver status. Please try again.');
    }
  };

  const handleEditDriver = (driver) => {
    // For now, we'll just log and show an alert
    // In a real implementation, you would open an edit modal
    console.log('✏️ Editing driver:', driver);
    alert(`Edit driver: ${driver.name}\n\nThis would open an edit form in a real implementation.`);
  };

  const columns = [
    {
      key: 'name',
      title: 'Name'
    },
    {
      key: 'email',
      title: 'Email'
    },
    {
      key: 'phone',
      title: 'Phone'
    },
    {
      key: 'vehicle_type',
      title: 'Vehicle'
    },
    {
      key: 'license_plate',
      title: 'License Plate'
    },
    {
      key: 'is_active',
      title: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'ACTIVE' : 'INACTIVE'}
        </span>
      )
    },
    {
      key: 'created_at',
      title: 'Added On',
      render: (value) => value ? new Date(value).toLocaleDateString() : '-'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDriver(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Drivers Management</h1>
          <p className="text-gray-500 text-sm">Manage delivery drivers and their vehicles</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-gold text-black font-semibold text-sm px-4 py-2 rounded-lg hover:bg-gold/70 flex items-center space-x-2"
        >
          <span>➕</span>
          <span>Add Driver</span>
        </button>
      </div>

      {/* Drivers Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-sm text-gray-600">Total Drivers</div>
          <div className="text-2xl font-bold text-gray-900">
            {drivers.length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-sm text-gray-600">Active Drivers</div>
          <div className="text-2xl font-bold text-green-600">
            {drivers.filter(d => d.is_active).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-sm text-gray-600">Motorcycles</div>
          <div className="text-2xl font-bold text-blue-600">
            {drivers.filter(d => d.vehicle_type === 'Motorcycle').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-sm text-gray-600">Vans/Trucks</div>
          <div className="text-2xl font-bold text-orange-600">
            {drivers.filter(d => d.vehicle_type === 'Van').length}
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={drivers}
        loading={loading}
        actions={[
          {
            label: 'Edit',
            onClick: (row) => handleEditDriver(row)
          },
          {
            label: row => row.is_active ? 'Deactivate' : 'Activate',
            onClick: (row) => handleToggleStatus(row.id, row.is_active)
          }
        ]}
      />

      {/* Add Driver Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Add New Driver</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={newDriver.name}
                  onChange={handleInputChange}
                  placeholder="John Driver"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={newDriver.email}
                  onChange={handleInputChange}
                  placeholder="driver@example.com"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={newDriver.phone}
                  onChange={handleInputChange}
                  placeholder="+254712345678"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type *
                </label>
                <select
                  name="vehicle_type"
                  value={newDriver.vehicle_type}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Vehicle Type</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Van">Van</option>
                  <option value="Truck">Truck</option>
                  <option value="Car">Car</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Plate *
                </label>
                <input
                  type="text"
                  name="license_plate"
                  value={newDriver.license_plate}
                  onChange={handleInputChange}
                  placeholder="KAA123A"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewDriver({
                    name: '',
                    email: '',
                    phone: '',
                    vehicle_type: '',
                    license_plate: ''
                  });
                }}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDriver}
                disabled={!newDriver.name || !newDriver.email || !newDriver.phone || !newDriver.vehicle_type || !newDriver.license_plate}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Driver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drivers;