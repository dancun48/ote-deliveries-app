// services/deliveryService.js
import api from './api';

export const deliveryService = {
  async createDelivery(deliveryData) {
    try {
      console.log('📦 Creating delivery:', deliveryData);
      const response = await api.post('/deliveries', deliveryData);
      console.log('✅ Delivery creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Delivery creation error:', error);
      throw error;
    }
  },

  async getUserDeliveries() {
    try {
      console.log('📋 Fetching user deliveries');
      const response = await api.get('/deliveries/my-deliveries');
      console.log('✅ User deliveries response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Get user deliveries error:', error);
      throw error;
    }
  },

  async trackDelivery(trackingNumber) {
    try {
      console.log('🔍 Tracking delivery:', trackingNumber);
      const response = await api.get(`/deliveries/track/${trackingNumber}`);
      console.log('✅ Track delivery response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Track delivery error:', error);
      throw error;
    }
  },

  async getAllDeliveries(page = 1, limit = 10) {
    try {
      console.log('📊 Fetching all deliveries:', { page, limit });
      const response = await api.get(`/deliveries?page=${page}&limit=${limit}`);
      console.log('✅ All deliveries response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Get all deliveries error:', error);
      throw error;
    }
  }
};