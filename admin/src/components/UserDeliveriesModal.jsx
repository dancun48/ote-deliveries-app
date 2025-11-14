// components/UserDeliveriesModal.jsx
import React from 'react';

const UserDeliveriesModal = ({ user, deliveries, isOpen, onClose, onAssignDriver }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Deliveries for {user?.first_name} {user?.last_name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {deliveries.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No deliveries found.</p>
          ) : (
            deliveries.map((delivery) => (
              <div key={delivery.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">Delivery #{delivery.id}</h4>
                    <p className="text-sm text-gray-600">Status: {delivery.status}</p>
                    <p className="text-sm text-gray-600">
                      Created: {new Date(delivery.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {delivery.status === 'pending' && (
                    <button
                      onClick={() => onAssignDriver(delivery)}
                      className="bg-gold text-black px-3 py-1 rounded text-sm font-medium hover:bg-gold/70"
                    >
                      Assign Driver
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDeliveriesModal;