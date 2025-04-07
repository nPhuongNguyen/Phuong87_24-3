import React, { useEffect, useState } from 'react';
import { getMyOrders } from '../api/orderAPI';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await getMyOrders();
        setOrders(ordersData);
      } catch (err) {
        setError(err.message || 'Không thể tải đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
        <button 
          className="btn btn-link" 
          onClick={() => window.location.reload()}
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-5">
        <h4>Bạn chưa có đơn hàng nào</h4>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => navigate('/products')}
        >
          Mua sắm ngay
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Đơn hàng của tôi</h2>
      
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Mã đơn hàng</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Địa chỉ giao hàng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id.substring(0, 8)}</td>
                <td>{new Date(order.OrderDate).toLocaleDateString()}</td>
                <td>{order.TotalPrice.toLocaleString('vi-VN')} VND</td>
                <td>
                  <span className={`badge ${
                    order.Trangthai === 'Đã giao' ? 'bg-success' : 
                    order.Trangthai === 'Đang giao' ? 'bg-warning' : 'bg-secondary'
                  }`}>
                    {order.Trangthai}
                  </span>
                </td>
                <td>{order.ShippingAddress}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-info"
                    onClick={() => navigate(`/orders/${order._id}`)}
                  >
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;