// src/api/signup.js
import axios from 'axios';
const API_URL = 'http://localhost:3000';
export const signupUser = async (username, password, email, fullName, avatarUrl, role) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        username,
        password,
        email,
        fullName,  
        avatarUrl, 
        role,     
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };
  

export const loginUser = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password
      });
  
      // Sau khi đăng nhập thành công, lưu token
      if (response.data.success && response.data.data) {
        localStorage.setItem("token", response.data.data); // data là token
      }
  
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };
  

  export const checkAuthentication = async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
  
    try {
      const response = await axios.get(`${API_URL}/auth/check-auth`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.user;
    } catch (error) {
      console.error('Không xác thực được người dùng:', error.message);
      return null;
    }
  };
