import React, { useEffect, useState } from 'react';
import { getCartItems, updateCartItemQuantity, deleteCartItem } from '../api/CartItemDBAPI';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const CartItems = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const items = await getCartItems();  // Lấy dữ liệu giỏ hàng từ API
        setCartItems(items);  // Lưu vào state
      } catch (err) {
        setError('Không thể lấy giỏ hàng');  // Xử lý lỗi nếu có
      } finally {
        setLoading(false);  // Đóng trạng thái loading
      }
    };

    fetchCartItems();  // Gọi hàm khi component mount
  }, []);  // Chỉ gọi một lần khi component mount

  const handleQuantityChange = async (ProductId, newQuantity) => {
    if (newQuantity <= 0) {
      alert('Số lượng phải lớn hơn 0');
      return;
    }

    try {
      const result = await updateCartItemQuantity(ProductId, newQuantity);
      if (result.message === 'Cập nhật thành công') {
        // Cập nhật giỏ hàng trên giao diện
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.ProductId === ProductId ? { ...item, Quantity: newQuantity } : item
          )
        );
      } else {
        alert(result.message);  // Hiển thị thông báo lỗi từ server
      }
    } catch (err) {
        alert('Lỗi khi cập nhật số lượng');
    }
  };

  const handleDeleteItem = async (ProductId) => {
    try {
        const result = await deleteCartItem(ProductId);
    
        if (result.message === 'Xóa sản phẩm khỏi giỏ hàng thành công!') {
          // Xóa sản phẩm khỏi giỏ hàng trên UI
          setCartItems(prevItems => prevItems.filter(item => item.ProductId !== ProductId));
        } else {
          alert('Không thể xóa sản phẩm');
        }
      } catch (err) {
        alert('Lỗi khi xóa sản phẩm');
      }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
        <p>Đang tải giỏ hàng...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-light border rounded">
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return <div className="text-center">Giỏ hàng của bạn hiện tại trống</div>;
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Giỏ Hàng</h2>
      <div className="list-group">
        {cartItems.map((item) => (
          <div className="list-group-item" key={item._id}>
            <div className="d-flex align-items-center">
              {/* Phần ảnh sản phẩm */}
              <div className="flex-shrink-0 me-3">
                <img
                  src={item.ProductId?.imgURL || '/placeholder-product.jpg'}
                  alt={item.ProductId?.productName}
                  className="img-thumbnail"
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
              </div>
              
              {/* Thông tin sản phẩm */}
              <div className="flex-grow-1">
                <h5 className="mb-1">{item.ProductId?.productName}</h5>
                <div className="d-flex align-items-center mb-2">
                  <span className="text-muted me-2">Số lượng:</span>
                  <input
                    type="number"
                    value={item.Quantity}
                    min="1"
                    onChange={(e) => handleQuantityChange(item.ProductId, Number(e.target.value))}
                    className="form-control form-control-sm"
                    style={{ width: '70px' }}
                  />
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-primary fw-bold">
                    {item.Price?.toLocaleString('vi-VN')} VND
                  </span>
                  <span className="text-muted">
                    Tổng: {(item.Price * item.Quantity).toLocaleString('vi-VN')} VND
                  </span>
                </div>
              </div>
              
              {/* Nút xóa */}
              <button 
                className="btn btn-outline-danger btn-sm ms-3"
                onClick={() => handleDeleteItem(item.ProductId)}
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-between align-items-center mt-4">
        <Link to="/products" className="btn btn-outline-secondary">
          ← Tiếp tục mua sắm
        </Link>
        
        <div className="text-end">
          <p className="h4 mb-3">
            Tổng cộng: {cartItems.reduce((total, item) => total + (item.Price * item.Quantity), 0).toLocaleString('vi-VN')} VND
          </p>
          <Link 
            to="/checkout" 
            className="btn btn-success btn-lg"
            disabled={cartItems.length === 0}
          >
            Thanh toán →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
