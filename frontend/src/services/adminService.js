import api from './api';

export const adminService = {
  async getAllDeliveries(page = 1, limit = 10) {
    const response = await api.get(`/admin/deliveries?page=${page}&limit=${limit}`);
    return response.data;
  },

  async updateDeliveryStatus(deliveryId, status) {
    const response = await api.patch(`/admin/deliveries/${deliveryId}/status`, { status });
    return response.data;
  },

  async getAllUsers(page = 1, limit = 10) {
    const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getDashboardStats() {
    const response = await api.get('/admin/stats');
    return response.data;
  }
};