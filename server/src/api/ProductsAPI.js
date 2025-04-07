
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getProductById = async (productId) => {
    try {
      const response = await axios.get(`${API_URL}/products/${productId}`, {
        withCredentials: true 
      });
      return response.data.data; 
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error.response?.data || error;
    }
  };

export const createProduct = async (formData) => {
    try {
      const response = await axios.post(`${API_URL}/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  export const updateProduct = async (productId, formData) => {
   
    try {
      const response = await axios.put(`${API_URL}/products/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  export const deleteProduct = async (productId) => {
    try {
      // Gọi API PUT để cập nhật trạng thái isDeleted
      const response = await axios.delete(`${API_URL}/products/${productId}`, {}, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };
  
