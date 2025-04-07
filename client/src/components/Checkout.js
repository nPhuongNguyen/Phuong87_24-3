import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api/orderAPI';
import { getCartItems } from '../api/CartItemDBAPI';
import 'bootstrap/dist/css/bootstrap.min.css';

const Checkout = () => {
  const [formData, setFormData] = useState({
    ShippingAddress: '',
    Sdt: '',
    Note: '',
    Trangthai: 'Chờ xác nhận'
  });
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const items = await getCartItems();
        setCartItems(items);
      } catch (err) {
        setError('Không thể lấy giỏ hàng');
      }
    };

    fetchCartItems();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.ShippingAddress || !formData.Sdt) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (cartItems.length === 0) {
      setError('Giỏ hàng trống không thể thanh toán');
      return;
    }

    setLoading(true);
    try {
      const result = await createOrder({
        ...formData,
        cartItems: cartItems.map(item => ({
          ProductId: item.ProductId,
          Quantity: item.Quantity,
          Price: item.Price
        }))
      });
      
      if (result.message === 'Đơn hàng đã được tạo!') {
        alert('Đặt hàng thành công!');
        navigate('/orders');
      } else {
        setError(result.message || 'Đặt hàng thất bại');
      }
    } catch (err) {
      setError(err.message || 'Lỗi khi đặt hàng');
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.Price * item.Quantity), 0);

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-7">
          <h2 className="mb-4">Thông tin thanh toán</h2>
          
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Địa chỉ giao hàng</label>
              <input
                type="text"
                className="form-control"
                name="ShippingAddress"
                value={formData.ShippingAddress}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Số điện thoại</label>
              <input
                type="tel"
                className="form-control"
                name="Sdt"
                value={formData.Sdt}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Ghi chú</label>
              <textarea
                className="form-control"
                name="Note"
                value={formData.Note}
                onChange={handleChange}
                rows="3"
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading || cartItems.length === 0}
            >
              {loading ? 'Đang xử lý...' : 'Đặt hàng'}
            </button>
          </form>
        </div>
        
        <div className="col-md-5">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">Đơn hàng của bạn</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {cartItems.map(item => (
                  <li key={item.ProductId} className="list-group-item d-flex justify-content-between">
                    <div>
                      <h6>{item.ProductId.productName}</h6>
                      <small className="text-muted">Số lượng: {item.Quantity}</small>
                    </div>
                    <span>{(item.Price * item.Quantity).toLocaleString('vi-VN')} VND</span>
                  </li>
                ))}
              </ul>
              <div className="d-flex justify-content-between mt-3 fw-bold">
                <span>Tổng cộng:</span>
                <span>{totalPrice.toLocaleString('vi-VN')} VND</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;