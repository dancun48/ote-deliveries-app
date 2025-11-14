import api from './api';

export const deliveryService = {
  async getAllDeliveries(page = 1, limit = 10) {
    const response = await api.get(`/deliveries?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getDeliveryById(deliveryId) {
    const response = await api.get(`/deliveries/${deliveryId}`);
    return response.data;
  },

  async updateDeliveryStatus(deliveryId, status) {
    const response = await api.patch(`/deliveries/${deliveryId}/status`, { status });
    return response.data;
  }
};