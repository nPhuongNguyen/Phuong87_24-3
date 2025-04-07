import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderDetails } from '../api/orderAPI';
import 'bootstrap/dist/css/bootstrap.min.css';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderData = await getOrderDetails(id);
        setOrder(orderData.order);
        setOrderItems(orderData.items);
      } catch (err) {
        setError(err.message || 'Không thể tải chi tiết đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!order) {
    return <div className="alert alert-warning">Không tìm thấy đơn hàng</div>;
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Chi tiết đơn hàng #{order._id.substring(0, 8)}</h2>
        <span className={`badge ${
          order.Trangthai === 'Đã giao' ? 'bg-success' : 
          order.Trangthai === 'Đang giao' ? 'bg-warning' : 'bg-secondary'
        }`}>
          {order.Trangthai}
        </span>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">Thông tin đơn hàng</h5>
            </div>
            <div className="card-body">
              <p><strong>Ngày đặt:</strong> {new Date(order.OrderDate).toLocaleString()}</p>
              <p><strong>Tổng tiền:</strong> {order.TotalPrice.toLocaleString('vi-VN')} VND</p>
              <p><strong>Địa chỉ giao hàng:</strong> {order.ShippingAddress}</p>
              <p><strong>Số điện thoại:</strong> {order.Sdt}</p>
              {order.Note && <p><strong>Ghi chú:</strong> {order.Note}</p>}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-light">
              <h5 className="mb-0">Sản phẩm</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {orderItems.map(item => (
                  <li key={item._id} className="list-group-item">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6>{item.ProductId.productName}</h6>
                        <small className="text-muted">Số lượng: {item.Quantity}</small>
                      </div>
                      <span>{(item.Price * item.Quantity).toLocaleString('vi-VN')} VND</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;