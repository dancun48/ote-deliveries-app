import React, { useState } from "react";
import LiveTrackingMap from "./LiveTrackingMap";

const DeliveryDetailsModal = ({ isOpen, onClose, delivery }) => {
  const [activeTab, setActiveTab] = useState("details");

  if (!isOpen || !delivery) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "picked_up":
        return "bg-orange-100 text-orange-800";
      case "in_transit":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "🟡";
      case "assigned":
        return "🔵";
      case "picked_up":
        return "🟠";
      case "in_transit":
        return "🚚";
      case "delivered":
        return "✅";
      case "cancelled":
        return "❌";
      default:
        return "📦";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateDuration = () => {
    if (!delivery.created_at) return "N/A";

    const created = new Date(delivery.created_at);
    const now = new Date();
    const diffMs = now - created;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Delivery #{delivery.tracking_number}
            </h2>
            <div className="flex items-center space-x-2 mt-1">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  delivery.status
                )}`}
              >
                {getStatusIcon(delivery.status)}{" "}
                {delivery.status?.replace("_", " ").toUpperCase()}
              </span>
              <span className="text-xs text-gray-500">
                • Created {formatDate(delivery.created_at)}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-semibold transition-colors"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("details")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "details"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              📋 Details
            </button>
            <button
              onClick={() => setActiveTab("tracking")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "tracking"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              📍 Live Tracking
            </button>
            <button
              onClick={() => setActiveTab("timeline")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "timeline"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              ⏱️ Timeline
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "details" && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Duration</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {calculateDuration()}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Priority</div>
                  <div className="text-lg font-semibold text-gray-900">
                    Standard
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Package Type</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {delivery.package_description ? "Custom" : "Standard"}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Last Updated</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatDate(delivery.updated_at || delivery.created_at)}
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Basic Information
                  </h3>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Tracking Number
                    </label>
                    <p className="text-sm text-gray-900 font-mono mt-1">
                      {delivery.tracking_number}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Customer
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {delivery.first_name} {delivery.last_name}
                    </p>
                    {delivery.email && (
                      <p className="text-xs text-gray-500 mt-1">
                        {delivery.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Created Date
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {formatDate(delivery.created_at)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Last Updated
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {formatDate(delivery.updated_at)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recipient Information */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recipient Information
                  </h3>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Recipient Name
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {delivery.recipient_name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Recipient Phone
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {delivery.recipient_phone || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Locations */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delivery Locations
                  </h3>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Pickup Address
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {delivery.pickup_address || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Delivery Address
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {delivery.delivery_address || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Package Information */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Package Information
                  </h3>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Package Description
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {delivery.package_description || "Standard Package"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Package Weight
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {delivery.package_weight || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Pricing Information */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Pricing Information
                  </h3>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Number of Boxes
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {delivery.number_of_boxes || 1} box
                      {delivery.number_of_boxes > 1 ? "es" : ""}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Delivery Zone
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {delivery.zone ? delivery.zone.toUpperCase() : "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Base Price
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      KES {delivery.base_price || 0}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Additional Box Price
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      KES {delivery.additional_box_price || 0}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">
                      Total Price
                    </label>
                    <p className="text-lg font-bold text-green-600 mt-1">
                      KES {delivery.total_price || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Driver Information */}
              {delivery.driver_name && (
                <div className="bg-white border border-gray-200 rounded-lg">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Assigned Driver
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {delivery.driver_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {delivery.driver_name}
                        </p>
                        <p className="text-xs text-gray-500">Assigned Driver</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "tracking" && (
            <LiveTrackingMap
              delivery={delivery}
              driver={
                delivery.driver_name
                  ? {
                      id: delivery.assigned_driver_id,
                      name: delivery.driver_name,
                    }
                  : null
              }
            />
          )}

          {activeTab === "timeline" && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delivery Timeline
                  </h3>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {/* Timeline items */}
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Delivery Created
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(delivery.created_at)}
                        </p>
                      </div>
                    </div>

                    {delivery.assigned_driver_id && (
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            Driver Assigned
                          </p>
                          <p className="text-xs text-gray-500">
                            {delivery.driver_name} assigned to delivery
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(delivery.updated_at)}
                          </p>
                        </div>
                      </div>
                    )}

                    {delivery.status === "delivered" && (
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            Delivery Completed
                          </p>
                          <p className="text-xs text-gray-500">
                            Package successfully delivered to recipient
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(delivery.updated_at)}
                          </p>
                        </div>
                      </div>
                    )}

                    {delivery.status === "cancelled" && (
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            Delivery Cancelled
                          </p>
                          <p className="text-xs text-gray-500">
                            Delivery was cancelled
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(delivery.updated_at)}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Current Status */}
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          delivery.status === "delivered"
                            ? "bg-green-500"
                            : delivery.status === "cancelled"
                            ? "bg-red-500"
                            : "bg-yellow-500 animate-pulse"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Current Status
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {delivery.status.replace("_", " ")}
                        </p>
                        <p className="text-xs text-gray-500">
                          Last updated: {formatDate(delivery.updated_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Legend */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">
                  Status Legend
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-blue-800">
                      Pending - Awaiting assignment
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-blue-800">
                      Assigned - Driver assigned
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-blue-800">
                      Picked Up - Package collected
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-blue-800">
                      In Transit - On the way
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-blue-800">
                      Delivered - Successfully completed
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-blue-800">
                      Cancelled - Delivery cancelled
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Delivery ID: {delivery.id}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            {delivery.status !== "delivered" &&
              delivery.status !== "cancelled" && (
                <button
                  onClick={() => {
                    // Add action for quick status update
                    console.log("Quick action for delivery:", delivery.id);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors"
                >
                  Quick Action
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetailsModal;
