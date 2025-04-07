import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_URL}/order/my-orders`, orderData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMyOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/order/my-orders`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Thêm vào orderAPI.js
export const getOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(`${API_URL}/order/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };