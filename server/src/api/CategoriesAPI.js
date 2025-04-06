import axios from 'axios';

const API_URL = 'http://localhost:3000'; 

export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`); 
    return response.data; 
  } catch (error) {
    console.error("Lỗi khi lấy danh mục:", error);
    throw error; 
  }
};

export const getCategoryById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/categories/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };
  
  export const updateCategory = async (id, data) => {
    try {
      const response = await axios.put(`${API_URL}/categories/${id}`, data, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };
