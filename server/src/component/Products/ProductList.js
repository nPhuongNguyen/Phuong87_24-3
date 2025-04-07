import React, { useEffect, useState } from 'react';
import { fetchProducts, deleteProduct } from '../../api/ProductsAPI';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Lấy danh sách sản phẩm khi component được mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetchProducts();
        setProducts(res.data);
      } catch (error) {
        console.error(error);
        setMessage(error.message || 'Có lỗi khi tải sản phẩm');
      }
    };

    loadProducts();
  }, []);

  // Hàm xóa sản phẩm
  const handleDelete = async (productId) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      setIsLoading(true);
      try {
        const res = await deleteProduct(productId); // Gọi API xóa
        if (res.success) {
          alert('Sản phẩm đã được xóa.');
        } else {
          alert('Không thể xóa sản phẩm.');
        }
      } catch (error) {
        console.error(error);
        alert('Có lỗi xảy ra khi xóa sản phẩm.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Danh sách sản phẩm</h2>
      <Link to={`/add-product`}>
        <Button variant="warning" size="sm" className="me-2">
          <FaEdit /> Thêm sản phẩm
        </Button>
      </Link>

      {message && <div className="alert alert-danger">{message}</div>}

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Tên sản phẩm</th>
              <th scope="col">Hình ảnh</th>
              <th scope="col">Mô tả</th>
              <th scope="col">Danh mục</th>
              <th scope="col">Giá</th>
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">Không có sản phẩm nào</td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr key={product._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{product.productName}</td>
                  <td>
                    <img
                      src={product.imgURL}
                      alt={product.productName}
                      className="img-thumbnail"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                  </td>
                  <td>{product.description}</td>
                  <td>{product.category?.categoryName || 'Không có'}</td>
                  <td>{product.price?.toLocaleString()} đ</td>
                  <td>
                    <Link to={`/edit-product/${product._id}`} className="btn btn-primary btn-sm">
                      Sửa
                    </Link>
                    <button
                      className="btn btn-danger btn-sm ms-2"
                      onClick={() => handleDelete(product._id)} // Gọi hàm xóa khi nhấn
                      disabled={isLoading}
                    >
                      {isLoading ? 'Đang xóa...' : 'Xóa'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
