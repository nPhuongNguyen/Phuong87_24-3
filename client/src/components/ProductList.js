import React, { useEffect, useState } from 'react';
import { getProducts } from '../api/productAPI';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await getProducts(); // Gọi API để lấy sản phẩm
        if (productRes.success) {
          setProducts(productRes.data);
        } else {
          setError('Không thể tải sản phẩm');
        }
      } catch (err) {
        setError('Lỗi khi tải dữ liệu sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 min-vh-50">
      <div className="spinner-border text-primary mb-3" role="status">
        <span className="visually-hidden">Đang tải...</span>
      </div>
      <p className="text-primary fw-bold">Đang tải dữ liệu sản phẩm...</p>
    </div>
  );

  if (error) return (
    <div className="text-center p-5 bg-light border rounded shadow">
      <div className="bg-danger text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: "60px", height: "60px" }}>
        <span className="fw-bold fs-4">!</span>
      </div>
      <h4 className="text-danger mb-3">Đã xảy ra lỗi</h4>
      <p className="text-secondary mb-4">{error}</p>
      <button className="btn btn-danger px-4 py-2" onClick={() => window.location.reload()}>
        Thử lại
      </button>
    </div>
  );

  return (
    <div className="container-fluid min-vh-100">
      <div className="container py-5">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {products.map(product => (
            <div key={product._id} className="col">
              <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
                {product.imgURL && (
                  <div className="card-img-top position-relative overflow-hidden" style={{ height: "220px" }}>
                    <img
                      src={product.imgURL}
                      alt={product.productName}
                      className="w-100 h-100"
                      style={{ objectFit: "cover", transition: "transform 0.5s" }}
                      onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                      onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                    />
                    <div className="position-absolute top-0 end-0 m-2">
                      <button className="btn btn-sm btn-light rounded-circle shadow-sm">
                        <i className="bi bi-heart"></i>
                      </button>
                    </div>
                  </div>
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-truncate">{product.productName}</h5>
                  {product.price && (
                    <p className="card-text fw-bold text-primary mb-2">{product.price.toLocaleString('vi-VN')} đ</p>
                  )}
                  {product.description && (
                    <p className="card-text text-muted small mb-3 overflow-hidden" style={{ height: "40px" }}>
                      {product.description}
                    </p>
                  )}
                  <div className="mt-auto d-flex gap-2">
                    <Link to={`/product/${product._id}`} className="btn btn-primary flex-grow-1">
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
