import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Đổi port nếu cần

export const getSales = async (queries = {}) => {
  try {
    const response = await axios.get(`${API_URL}/sale`, {
      params: queries,
    });
    return response.data; 
  } catch (error) {
    console.error('Lỗi khi lấy role:', error);
    throw error;
  }
};