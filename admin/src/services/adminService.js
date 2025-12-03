// services/adminService.js
import api from "./api";

export const adminService = {
  // Dashboard Stats
  async getDashboardStats() {
    try {
      const response = await api.get("/admin/stats");
      // Handle both response formats
      const responseData = response.data;

      // If the backend returns data directly without wrapping in 'data' property
      if (responseData.stats !== undefined) {
        return responseData; // Return as-is: {success: true, stats: {...}}
      }

      // If wrapped in 'data' property
      if (responseData.data?.stats !== undefined) {
        return responseData; // Return as-is: {success: true, data: {stats: {...}}}
      }

      console.warn("⚠️ Unexpected response format:", responseData);
      return responseData;
    } catch (error) {
      console.error("❌ Error fetching dashboard stats:", error);
      // Return mock data if API fails for development
      return {
        success: true,
        stats: {
          totalDeliveries: 156,
          pendingDeliveries: 12,
          totalUsers: 89,
          todayDeliveries: 8,
        },
      };
    }
  },

  // Users Management
  async getAllUsers(page = 1, limit = 10) {
    try {
      const response = await api.get(
        `/admin/users?page=${page}&limit=${limit}`
      );

      // Handle both response formats
      const responseData = response.data;

      // If the backend returns data directly without wrapping in 'data' property
      if (responseData.users !== undefined) {
        return responseData; // Return as-is: {success: true, users: [], pagination: {}}
      }

      // If wrapped in 'data' property
      if (responseData.data?.users !== undefined) {
        return responseData; // Return as-is: {success: true, data: {users: [], pagination: {}}}
      }

      console.warn("⚠️ Unexpected response format:", responseData);
      return responseData;
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      // Return mock data for development
      return {
        success: true,
        users: [
          {
            id: 1,
            email: "john@example.com",
            first_name: "John",
            last_name: "Doe",
            user_type: "personal",
            created_at: "2024-01-15",
          },
          {
            id: 2,
            email: "sarah@company.com",
            first_name: "Sarah",
            last_name: "Smith",
            user_type: "corporate",
            company_name: "Tech Corp",
            created_at: "2024-01-14",
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      };
    }
  },

  // Deliveries Management
  async getAllDeliveries(page = 1, limit = 10) {
    try {
      const response = await api.get(
        `/admin/deliveries?page=${page}&limit=${limit}`
      );

      // Handle both response formats
      const responseData = response.data;
      console.log("📦 Deliveries API response:", responseData);

      // If the backend returns data directly without wrapping in 'data' property
      if (responseData.deliveries !== undefined) {
        return responseData; // Return as-is: {success: true, deliveries: [], pagination: {}}
      }

      // If wrapped in 'data' property
      if (responseData.data?.deliveries !== undefined) {
        return responseData; // Return as-is: {success: true, data: {deliveries: [], pagination: {}}}
      }

      console.warn("⚠️ Unexpected response format:", responseData);
      return responseData;
    } catch (error) {
      console.error("❌ Error fetching deliveries:", error);
      // Return mock data with UUID format for development
      return {
        success: true,
        deliveries: [
          {
            id: "550e8400-e29b-41d4-a716-446655440000",
            tracking_number: "TRK123456",
            first_name: "John",
            last_name: "Doe",
            recipient_name: "Jane Smith",
            recipient_phone: "+254712345678",
            status: "pending",
            created_at: new Date().toISOString(),
          },
          {
            id: "550e8400-e29b-41d4-a716-446655440001",
            tracking_number: "TRK123457",
            first_name: "Sarah",
            last_name: "Johnson",
            recipient_name: "Mike Brown",
            recipient_phone: "+254712345679",
            status: "in_transit",
            created_at: new Date().toISOString(),
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      };
    }
  },

  async updateDeliveryStatus(deliveryId, status) {
    try {
      console.log("🔄 Updating delivery status:", { deliveryId, status });

      const response = await api.patch(
        `/admin/deliveries/${deliveryId}/status`,
        { status }
      );

      console.log("✅ Delivery status update response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error updating delivery status:", error);

      // Check if it's a UUID format error
      if (
        error.response?.status === 400 &&
        error.response?.data?.message?.includes("UUID")
      ) {
        throw new Error("Invalid delivery ID format. Please refresh the page.");
      }

      throw error;
    }
  },

  // Driver Assignment Functions
  async assignDriverToDelivery(deliveryId, driverId) {
    try {
      console.log("🔄 Assigning driver:", { deliveryId, driverId });

      const response = await api.patch(
        `/admin/deliveries/${deliveryId}/assign-driver`,
        { driver_id: driverId }
      );

      console.log("✅ Driver assignment response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error assigning driver:", error);
      throw error;
    }
  },

  async getAvailableDrivers() {
    try {
      const response = await api.get("/admin/drivers/available");
      if (!response) {
        throw new Error("No response from server");
      }
      const responseData = response.data;
      if (!responseData) {
        throw new Error("No data in response");
      }
      // Handle both response formats
      if (responseData.success === false) {
        throw new Error(
          responseData.message || "Failed to fetch available drivers"
        );
      }
      let driversData =
        responseData.drivers || responseData.data?.drivers || [];
      // Map is_active to is_available for frontend compatibility
      driversData = driversData.map((driver) => ({
        ...driver,
        is_available: driver.is_active, // Map the field
      }));
      return {
        ...responseData,
        drivers: driversData,
      };
    } catch (error) {
      console.error("❌ Error fetching available drivers:", error);
    }
  },

  async getUserDeliveries(userId) {
    try {
      const response = await api.get(`/admin/users/${userId}/deliveries`);
      const responseData = response.data;
      // Handle both response formats
      if (responseData.deliveries !== undefined) {
        return responseData;
      }

      if (responseData.data?.deliveries !== undefined) {
        return responseData;
      }
      return responseData;
    } catch (error) {
      console.error("❌ Error fetching user deliveries:", error);
    }
  },

  // Driver Management
  async getAllDrivers(page = 1, limit = 10) {
    try {
      const response = await api.get(`/drivers?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching drivers:", error);
    }
  },

  async createDriver(driverData) {
    try {
      const response = await api.post("/drivers", driverData);
      return response.data;
    } catch (error) {
      console.error("❌ Error creating driver:", error);
      throw error;
    }
  },

  async updateDriverStatus(driverId, is_active) {
    try {
      const response = await api.patch(`/drivers/${driverId}/status`, {
        is_active,
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error updating driver status:", error);
      throw error;
    }
  },

  async updateDriver(driverId, driverData) {
    try {
      const response = await api.put(`/drivers/${driverId}`, driverData);
      return response.data;
    } catch (error) {
      console.error("❌ Error updating driver:", error);
      throw error;
    }
  },

  async getDriverById(driverId) {
    try {
      const response = await api.get(`/drivers/${driverId}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching driver:", error);
      throw error;
    }
  },

  // User Management
  async createUser(userData) {
    try {
      const response = await api.post("/admin/users", userData);
      return response.data;
    } catch (error) {
      console.error("❌ Error creating user:", error);
      throw error;
    }
  },

  async updateUser(userId, userData) {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error("❌ Error updating user:", error);
      throw error;
    }
  },

  async deleteUser(userId) {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error deleting user:", error);
      throw error;
    }
  },
  async getRevenueStats() {
    try {
      const response = await api.get("/deliveries/stats/revenue");
      return response.data;
    } catch (error) {
      console.error("Error fetching revenue stats:", error);
      throw error;
    }
  },

  async getZoneStats() {
    try {
      const response = await api.get("/deliveries/stats/zones");
      return response.data;
    } catch (error) {
      console.error("Error fetching zone stats:", error);
      throw error;
    }
  },
};
