import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { deliveryService } from '../services/deliveryService';
import { useNavigate } from 'react-router-dom';

const BookDelivery = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pickupAddress: '',
    deliveryAddress: '',
    recipientName: '',
    recipientPhone: '',
    packageDescription: '',
    packageWeight: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('📦 Form submission started:', formData);
  setLoading(true);

  try {
    // Validate required fields
    if (!formData.pickupAddress || !formData.deliveryAddress || !formData.recipientName || !formData.recipientPhone) {
      alert('Please fill in all required fields');
      setLoading(false);
      return;
    }

    console.log('🚀 Sending delivery request...');
    const result = await deliveryService.createDelivery(formData);
    
    console.log('✅ Delivery response:', result);
    
    if (result.success) {
      alert(`Delivery booked successfully! Tracking number: ${result.data.delivery.trackingNumber}`);
      // Reset form
      setFormData({
        pickupAddress: '',
        deliveryAddress: '',
        recipientName: '',
        recipientPhone: '',
        packageDescription: '',
        packageWeight: ''
      });
      navigate('/dashboard');
    } else {
      alert('Error: ' + (result.message || 'Unknown error'));
    }
  } catch (error) {
    console.error('❌ Booking error:', error);
    alert('Error booking delivery: ' + (error.message || 'Something went wrong. Please try again.'));
  } finally {
    setLoading(false);
  }
};
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to book a delivery</h2>
          <a href="/login" className="text-blue-600 hover:text-blue-500">Login here</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Book a Delivery</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="pickupAddress" className="block text-sm font-medium text-gray-700">
                Pickup Address *
              </label>
              <textarea
                id="pickupAddress"
                name="pickupAddress"
                required
                rows="3"
                value={formData.pickupAddress}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter full pickup address including street, city, and postal code"
              />
            </div>

            <div>
              <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700">
                Delivery Address *
              </label>
              <textarea
                id="deliveryAddress"
                name="deliveryAddress"
                required
                rows="3"
                value={formData.deliveryAddress}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter full delivery address including street, city, and postal code"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  id="recipientName"
                  name="recipientName"
                  required
                  value={formData.recipientName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Full name of recipient"
                />
              </div>

              <div>
                <label htmlFor="recipientPhone" className="block text-sm font-medium text-gray-700">
                  Recipient Phone *
                </label>
                <input
                  type="tel"
                  id="recipientPhone"
                  name="recipientPhone"
                  required
                  value={formData.recipientPhone}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Phone number with country code"
                />
              </div>
            </div>

            <div>
              <label htmlFor="packageDescription" className="block text-sm font-medium text-gray-700">
                Package Description
              </label>
              <textarea
                id="packageDescription"
                name="packageDescription"
                rows="2"
                value={formData.packageDescription}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the package contents, dimensions, etc."
              />
            </div>

            <div>
              <label htmlFor="packageWeight" className="block text-sm font-medium text-gray-700">
                Package Weight (kg)
              </label>
              <input
                type="number"
                id="packageWeight"
                name="packageWeight"
                step="0.1"
                min="0.1"
                value={formData.packageWeight}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Weight in kilograms"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gold text-white py-2 px-4 rounded-md hover:bg-gold/70 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Booking...
                  </span>
                ) : (
                  'Book Delivery'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookDelivery;