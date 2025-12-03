import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../frontend/src/context/AuthContext';
import { deliveryService } from '../../../frontend/src/services/deliveryService';
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
    packageWeight: '',
    numberOfBoxes: 1
  });
  const [selectedZone, setSelectedZone] = useState('');
  const [basePrice, setBasePrice] = useState(0);
  const [additionalBoxPrice, setAdditionalBoxPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [filteredAreas, setFilteredAreas] = useState([]);

  // Zone configuration with areas and prices
  const zones = {
    'zone1': {
      basePrice: 200, // Price for 1-2 boxes
      additionalBoxPrice: 100, // Price per additional box beyond 2
      areas: [
        'Town CBD', 'Mage City', 'Millmani', 'Kibuye', 'Arina',
        'Patel flats', 'Mosque', 'Tom Mboya', 'Mountain View',
        'Wyalenda', 'Oboie RD', 'Mamboleo'
      ]
    },
    'zone2': {
      basePrice: 350,
      additionalBoxPrice: 100,
      areas: [
        'Ahero', 'Rabuor', 'Alendu', 'Kisian', 'Maseno',
        'Majengo', 'Kiboswa', 'Gambogi', 'Chiga'
      ]
    },
    'zone3': {
      basePrice: 400,
      additionalBoxPrice: 100,
      areas: [
        'Holo', 'Luanda', 'Mbale', 'Chavakali', 'Kombewa'
      ]
    },
    'zone4': {
      basePrice: 500,
      additionalBoxPrice: 100,
      areas: [
        'Katito', 'Kombewa', 'Muk husalaba', 'Sagam',
        'Lvak', 'Mahoroni', 'Kabujol', 'Sabatia'
      ]
    }
  };

  // Calculate total price based on number of boxes
  useEffect(() => {
    if (selectedZone && zones[selectedZone]) {
      const zone = zones[selectedZone];
      const numberOfBoxes = parseInt(formData.numberOfBoxes) || 1;
      
      setBasePrice(zone.basePrice);
      setFilteredAreas(zone.areas);
      
      // Calculate additional box price
      if (numberOfBoxes <= 2) {
        setAdditionalBoxPrice(0);
        setTotalPrice(zone.basePrice);
      } else {
        const additionalBoxes = numberOfBoxes - 2;
        const additionalCost = additionalBoxes * zone.additionalBoxPrice;
        setAdditionalBoxPrice(additionalCost);
        setTotalPrice(zone.basePrice + additionalCost);
      }
    } else {
      setBasePrice(0);
      setAdditionalBoxPrice(0);
      setTotalPrice(0);
      setFilteredAreas([]);
    }
  }, [selectedZone, formData.numberOfBoxes]);

  const handleZoneChange = (e) => {
    setSelectedZone(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAreaSelect = (area, field) => {
    setFormData({
      ...formData,
      [field]: area
    });
  };

  const handleBoxQuantityChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1); // Minimum 1 box
    setFormData({
      ...formData,
      numberOfBoxes: value
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

      // Validate zone selection
      if (!selectedZone) {
        alert('Please select a delivery zone');
        setLoading(false);
        return;
      }

      console.log('🚀 Sending delivery request...');
      const deliveryData = {
        ...formData,
        zone: selectedZone,
        basePrice: basePrice,
        additionalBoxPrice: additionalBoxPrice,
        totalPrice: totalPrice,
        numberOfBoxes: parseInt(formData.numberOfBoxes)
      };

      const result = await deliveryService.createDelivery(deliveryData);
      
      console.log('✅ Delivery response:', result);
      
      if (result.success) {
        alert(`Delivery booked successfully!\n\nTracking number: ${result.data.delivery.trackingNumber}\nNumber of boxes: ${formData.numberOfBoxes}\nTotal Price: KES ${totalPrice}`);
        // Reset form
        setFormData({
          pickupAddress: '',
          deliveryAddress: '',
          recipientName: '',
          recipientPhone: '',
          packageDescription: '',
          packageWeight: '',
          numberOfBoxes: 1
        });
        setSelectedZone('');
        setTotalPrice(0);
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Book a Delivery</h1>
          
          {/* Zone Selection */}
          <div className="mb-6">
            <label htmlFor="zone" className="block text-sm font-medium text-gray-700 mb-2">
              Select Delivery Zone *
            </label>
            <select
              id="zone"
              value={selectedZone}
              onChange={handleZoneChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Choose a zone...</option>
              <option value="zone1">Zone 1 - Base: KES 200 (1-2 boxes)</option>
              <option value="zone2">Zone 2 - Base: KES 350 (1-2 boxes)</option>
              <option value="zone3">Zone 3 - Base: KES 400 (1-2 boxes)</option>
              <option value="zone4">Zone 4 - Base: KES 500 (1-2 boxes)</option>
            </select>
          </div>

          {/* Number of Boxes */}
          <div className="mb-6">
            <label htmlFor="numberOfBoxes" className="block text-sm font-medium text-gray-700 mb-2">
              Number of Boxes/Parcels *
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                id="numberOfBoxes"
                name="numberOfBoxes"
                min="1"
                max="20"
                value={formData.numberOfBoxes}
                onChange={handleBoxQuantityChange}
                className="w-24 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <span className="text-sm text-gray-600">
                {formData.numberOfBoxes === 1 ? '1 box' : `${formData.numberOfBoxes} boxes`}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Base price covers 1-2 boxes. Additional boxes charged separately.
            </p>
          </div>

          {/* Price Breakdown */}
          {totalPrice > 0 && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-green-800">Price Breakdown</h3>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-800">KES {totalPrice}</p>
                    <p className="text-sm text-green-600">Total Price</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex justify-between py-1 border-b border-green-100">
                      <span className="text-green-700">Base Price (1-2 boxes):</span>
                      <span className="font-medium">KES {basePrice}</span>
                    </div>
                    {additionalBoxPrice > 0 && (
                      <div className="flex justify-between py-1 border-b border-green-100">
                        <span className="text-green-700">
                          Additional {formData.numberOfBoxes - 2} box{formData.numberOfBoxes - 2 > 1 ? 'es' : ''}:
                        </span>
                        <span className="font-medium">KES {additionalBoxPrice}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-1 font-semibold">
                      <span className="text-green-800">Total:</span>
                      <span className="text-green-800">KES {totalPrice}</span>
                    </div>
                  </div>
                  
                  <div className="text-green-700 text-sm">
                    <p><strong>Zone:</strong> {selectedZone.toUpperCase()}</p>
                    <p><strong>Boxes:</strong> {formData.numberOfBoxes}</p>
                    {additionalBoxPrice > 0 && (
                      <p><strong>Rate:</strong> KES {zones[selectedZone]?.additionalBoxPrice} per additional box</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pickup Address with Area Selection */}
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
              
              {/* Area Suggestions for Pickup */}
              {filteredAreas.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-2">Quick select pickup area:</p>
                  <div className="flex flex-wrap gap-2">
                    {filteredAreas.map((area) => (
                      <button
                        key={`pickup-${area}`}
                        type="button"
                        onClick={() => handleAreaSelect(area, 'pickupAddress')}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full hover:bg-blue-200 transition-colors"
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Address with Area Selection */}
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
              
              {/* Area Suggestions for Delivery */}
              {filteredAreas.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-2">Quick select delivery area:</p>
                  <div className="flex flex-wrap gap-2">
                    {filteredAreas.map((area) => (
                      <button
                        key={`delivery-${area}`}
                        type="button"
                        onClick={() => handleAreaSelect(area, 'deliveryAddress')}
                        className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full hover:bg-green-200 transition-colors"
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>
              )}
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

            {/* Zone Information Display */}
            {selectedZone && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">
                  {selectedZone.toUpperCase()} - Covered Areas
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-blue-800">
                  {filteredAreas.map((area) => (
                    <div key={area} className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {area}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !selectedZone}
                className="flex-1 bg-gold text-white py-2 px-4 rounded-md hover:bg-gold/70 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Booking...
                  </span>
                ) : (
                  `Book Delivery - KES ${totalPrice}`
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Zone Pricing Information */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Delivery Zones & Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(zones).map(([zoneKey, zoneInfo]) => (
              <div key={zoneKey} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">
                  {zoneKey.toUpperCase()} - Base: KES {zoneInfo.basePrice}
                </h3>
                <p className="text-sm text-gray-600 mb-1">(1-2 boxes/parcels)</p>
                <p className="text-sm text-gray-700 mb-3">
                  Additional boxes: KES {zoneInfo.additionalBoxPrice} per box
                </p>
                <div className="text-sm">
                  <p className="font-medium text-gray-700 mb-2">Covered Areas:</p>
                  <ul className="space-y-1">
                    {zoneInfo.areas.map((area) => (
                      <li key={area} className="text-gray-600">• {area}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDelivery;