import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../api/productAPI';
import { addToCart } from '../api/CartItemDBAPI'; // Nhập hàm addToCart
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); // Trạng thái cho số lượng sản phẩm
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(''); // Thông báo thêm sản phẩm thành công

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        const productData = response.data?.data || response.data;
        if (!productData) {
          throw new Error('Sản phẩm không tồn tại');
        }
        setProduct(productData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const response = await addToCart(product._id, quantity); // Gọi API thêm vào giỏ hàng
      setMessage(response.message); // Hiển thị thông báo từ server
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi thêm vào giỏ hàng');
    }
  };

  // Kiểm tra loading/error trước
  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;
  if (!product) return <div>Không tìm thấy sản phẩm</div>;

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-6 col-md-12">
          <div className="overflow-hidden">
            <img
              src={product.imgURL}
              alt={product.productName}
              className="img-fluid rounded shadow-sm"
              style={{ height: "400px", objectFit: "cover" }}
            />
          </div>
        </div>

        <div className="col-lg-6 col-md-12 mt-4 mt-lg-0">
          <h1 className="mb-3">{product.productName}</h1>
          <p className="text-muted">{product.description}</p>
          <p className="text-primary fw-bold fs-4">{product.price?.toLocaleString('vi-VN')} VND</p>

          {/* Thêm vào giỏ hàng */}
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div>
              <label htmlFor="quantity" className="form-label">Số lượng:</label>
              <input
                type="number"
                id="quantity"
                className="form-control"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              />
            </div>

            <button className="btn btn-success btn-lg" onClick={handleAddToCart}>
              Thêm vào giỏ hàng
            </button>
          </div>

          {/* Hiển thị thông báo */}
          {message && <div className="alert alert-success mt-3">{message}</div>}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
