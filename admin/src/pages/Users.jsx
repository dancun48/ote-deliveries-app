// Updated Users.jsx with real-time functionality
import React, { useState, useEffect } from "react";
import { adminService } from "../services/adminService";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import UserForm from "../components/UserForm";
import AssignDriverModal from "../components/AssignDriverModal";
import UserDeliveriesModal from "../components/UserDeliveriesModal";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignDriverModal, setShowAssignDriverModal] = useState(false);
  const [showUserDeliveriesModal, setShowUserDeliveriesModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [userDeliveries, setUserDeliveries] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers();

      if (response.success) {
        const usersData = response.users || response.data?.users || [];
        setUsers(usersData);
      }
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      showNotification("error", "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const handleAddUser = async (userData) => {
    try {
      setActionLoading(true);
      const response = await adminService.createUser(userData);

      if (response.success) {
        setShowAddModal(false);
        showNotification("success", "User created successfully");
        fetchUsers(); // Refresh the list
      }
    } catch (error) {
      console.error("❌ Error creating user:", error);
      showNotification("error", "Failed to create user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditUser = async (userData) => {
    try {
      setActionLoading(true);
      const response = await adminService.updateUser(selectedUser.id, userData);

      if (response.success) {
        setShowEditModal(false);
        setSelectedUser(null);
        showNotification("success", "User updated successfully");
        fetchUsers(); // Refresh the list
      }
    } catch (error) {
      console.error("❌ Error updating user:", error);
      showNotification("error", "Failed to update user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setActionLoading(true);
      const response = await adminService.deleteUser(selectedUser.id);

      if (response.success) {
        setShowDeleteModal(false);
        setSelectedUser(null);
        showNotification("success", "User deleted successfully");
        fetchUsers(); // Refresh the list
      }
    } catch (error) {
      console.error("❌ Error deleting user:", error);
      showNotification("error", "Failed to delete user");
    } finally {
      setActionLoading(false);
    }
  };

  // Updated real-time function
  const handleAssignDriver = async (deliveryId, driverId) => {
    try {
      await adminService.assignDriverToDelivery(deliveryId, driverId);

      // Real-time updates
      showNotification(
        "success",
        `Driver assigned successfully to delivery #${deliveryId}`
      );

      // If user deliveries modal is open, refresh the deliveries
      if (showUserDeliveriesModal && selectedUser) {
        await handleViewUserDeliveries(selectedUser);
      }
    } catch (error) {
      console.error("❌ Error assigning driver:", error);
      showNotification("error", "Failed to assign driver. Please try again.");
      throw error;
    }
  };

  // Updated real-time function
  const handleViewUserDeliveries = async (user) => {
  try {
    console.log('View deliveries for user:', user.id);
    setSelectedUser(user);
    
    // Fetch real delivery data for this user with UUIDs
    const response = await adminService.getUserDeliveries(user.id);
    console.log('📦 User deliveries response:', response);
    
    if (response.success) {
      // Handle both response formats
      const deliveries = response.deliveries || response.data?.deliveries || [];
      console.log('📦 User deliveries data:', deliveries);
      setUserDeliveries(deliveries);
      setShowUserDeliveriesModal(true);
    } else {
      const errorMsg = response.message || 'Failed to load user deliveries';
      console.error('❌ API returned error:', errorMsg);
      showNotification('error', errorMsg);
    }
    
  } catch (error) {
    console.error('❌ Error fetching user deliveries:', error);
    showNotification('error', 'Failed to load user deliveries');
  }
};

  const handleOpenAssignDriver = (delivery) => {
    setSelectedDelivery(delivery);
    setShowAssignDriverModal(true);
  };

  const columns = [
    {
      key: "email",
      title: "Email",
    },
    {
      key: "name",
      title: "Name",
      render: (_, row) => `${row.first_name} ${row.last_name}`,
    },
    {
      key: "user_type",
      title: "Type",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === "corporate" ? "bg-gold text-black" : "bg-black text-white"
          }`}
        >
          {value?.toUpperCase() || "PERSONAL"}
        </span>
      ),
    },
    {
      key: "company_name",
      title: "Company",
      render: (value) => value || "-",
    },
    {
      key: "created_at",
      title: "Joined",
      render: (value) => (value ? new Date(value).toLocaleDateString() : "-"),
    },
  ];

  const actions = [
    {
      label: "View Deliveries",
      onClick: (row) => handleViewUserDeliveries(row),
      variant: "primary",
    },
    {
      label: "Edit",
      onClick: (row) => {
        setSelectedUser(row);
        setShowEditModal(true);
      },
    },
    {
      label: "Delete",
      onClick: (row) => {
        setSelectedUser(row);
        setShowDeleteModal(true);
      },
      variant: "danger",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-lg ${
            notification.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
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
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-500 text-sm">Manage customer accounts</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gold text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gold/70"
        >
          Add User
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm font-semibold text-gray-600">Total Users</div>
          <div className="text-2xl font-bold text-gray-900">{users.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm font-semibold text-gray-600">
            Personal Users
          </div>
          <div className="text-2xl font-bold text-black">
            {users.filter((u) => u.user_type === "personal").length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm font-semibold text-gray-600">
            Corporate Users
          </div>
          <div className="text-2xl font-bold text-black">
            {users.filter((u) => u.user_type === "corporate").length}
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        actions={actions}
      />

      {/* Add User Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New User"
        size="md"
      >
        <UserForm
          onSubmit={handleAddUser}
          onCancel={() => setShowAddModal(false)}
          loading={actionLoading}
        />
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        title="Edit User"
        size="md"
      >
        <UserForm
          user={selectedUser}
          onSubmit={handleEditUser}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          loading={actionLoading}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedUser(null);
        }}
        title="Delete User"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete user{" "}
            <strong>{selectedUser?.email}</strong>? This action cannot be
            undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedUser(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteUser}
              disabled={actionLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {actionLoading ? "Deleting..." : "Delete User"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Assign Driver Modal */}
      <AssignDriverModal
        isOpen={showAssignDriverModal}
        onClose={() => {
          setShowAssignDriverModal(false);
          setSelectedDelivery(null);
        }}
        delivery={selectedDelivery}
        onAssign={handleAssignDriver}
      />

      <Modal
        isOpen={showUserDeliveriesModal}
        onClose={() => {
          setShowUserDeliveriesModal(false);
          setSelectedUser(null);
          setUserDeliveries([]);
        }}
        title={`Deliveries for ${selectedUser?.first_name} ${selectedUser?.last_name}`}
        size="lg"
      >
        <div className="space-y-4">
          {userDeliveries.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <p className="text-gray-500 text-lg">
                No deliveries found for this user.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                All deliveries will appear here once created.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {userDeliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900">
                          Delivery #{delivery.tracking_number || delivery.id}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            delivery.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : delivery.status === "assigned"
                              ? "bg-blue-100 text-blue-800"
                              : delivery.status === "in_progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : delivery.status === "pending"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {delivery.status?.replace("_", " ").toUpperCase() ||
                            "UNKNOWN"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        {delivery.pickup_address && (
                          <div>
                            <span className="font-medium">Pickup:</span>{" "}
                            {delivery.pickup_address}
                          </div>
                        )}
                        {delivery.dropoff_address && (
                          <div>
                            <span className="font-medium">Dropoff:</span>{" "}
                            {delivery.dropoff_address}
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Created:</span>{" "}
                          {delivery.created_at
                            ? new Date(delivery.created_at).toLocaleDateString()
                            : "N/A"}
                        </div>
                        {delivery.driver_name && (
                          <div>
                            <span className="font-medium">Driver:</span>{" "}
                            {delivery.driver_name}
                          </div>
                        )}
                      </div>
                    </div>

                    {delivery.status === "pending" && (
                      <button
                        onClick={() => {
                          console.log(
                            "🎯 Opening assign driver for delivery:",
                            delivery
                          );
                          setSelectedDelivery(delivery);
                          setShowAssignDriverModal(true);
                        }}
                        className="ml-4 bg-gold text-black px-3 py-2 rounded text-sm font-medium hover:bg-gold/70 transition-colors"
                      >
                        Assign Driver
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Users;
