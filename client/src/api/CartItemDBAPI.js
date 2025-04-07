import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Thay bằng URL thực tế của bạn

// Hàm thêm sản phẩm vào giỏ hàng
export const addToCart = async (ProductId, Quantity) => {
  try {
    const response = await axios.post(`${API_URL}/cartitem/cartitems`, { ProductId, Quantity }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error('Lỗi khi thêm vào giỏ hàng:', error);
    throw error; // Ném lỗi để xử lý ở component
  }
};

export const getCartItems = async () => {
  try {
    const response = await axios.get(`${API_URL}/cartitem/cartitems`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data || [];
  } catch (error) {
    // 👇 Nếu server trả về lỗi 404 (giỏ hàng trống), trả về mảng rỗng
    if (error.response && error.response.status === 404) {
      return [];
    }
    console.error('Lỗi khi lấy giỏ hàng:', error);
    throw error;
  }
};


export const updateCartItemQuantity = async (ProductId, newQuantity) => {
    try {
      const response = await axios.post(`${API_URL}/cartitem/update`, {
        ProductId,
        newQuantity
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;  // Trả về thông báo thành công và thông tin giỏ hàng
    } catch (error) {
      console.error('Lỗi khi cập nhật giỏ hàng:', error);
      throw error;
    }
  };

  export const deleteCartItem = async (ProductId) => {
    try {
      const response = await axios.delete(`${API_URL}/cartitem/delete`, {
        data: { ProductId },  // Gửi dữ liệu dưới dạng body
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;  // Trả về thông báo xóa thành công
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
      throw error;
    }
  };
  
