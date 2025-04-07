import React, { useEffect, useState } from 'react';
import { createProduct } from '../../api/ProductsAPI';
import { getCategories } from '../../api/CategoriesAPI';
import { getSales } from '../../api/SaleAPI';
import { useNavigate } from 'react-router-dom';

const CreateProduct = () => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [sale, setSale] = useState('');
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [sales, setSales] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const catRes = await getCategories();
        const saleRes = await getSales();
        setCategories(catRes || []);
        setSales(saleRes.data || []);
      } catch (err) {
        console.error('Lỗi khi load danh mục hoặc giảm giá', err);
        setMessage('Lỗi khi tải dữ liệu danh mục hoặc giảm giá');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate
    if (!productName || !price || !quantity || !category || !avatar) {
      setMessage('Vui lòng điền đủ thông tin và chọn ảnh!');
      return;
    }
  
    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('price', price);
    formData.append('quantity', quantity);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('sale', sale);
    formData.append('avatar', avatar); // Đảm bảo append file
  
    try {
      setIsLoading(true);
      await createProduct(formData);
      
      setMessage('Tạo sản phẩm thành công!');
      setTimeout(() => {
        navigate('/products');
      }, 1500);
      // Reset form
      setProductName('');
      setPrice('');
      setQuantity('');
      setDescription('');
      setCategory('');
      setSale('');
      setAvatar(null);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Lỗi khi tạo sản phẩm');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="container mt-4">
      <h2>Thêm sản phẩm</h2>
      {message && (
        <div
          className={`alert ${
            message.includes('Lỗi') ? 'alert-danger' : 'alert-info'
          }`}
        >
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label>Tên sản phẩm</label>
          <input
            className="form-control"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Giá</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Số lượng</label>
          <input
            type="number"
            className="form-control"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Mô tả</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Danh mục</label>
          <select
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <option key={cat._id} value={cat.categoryName}>
                  {cat.categoryName}
                </option>
              ))
            ) : (
              <option value="">Không có danh mục</option>
            )}
          </select>
        </div>
        <div className="mb-3">
          <label>Giảm giá</label>
          <select
            className="form-control"
            value={sale}
            onChange={(e) => setSale(e.target.value)}
          >
            <option value="">-- Không giảm giá --</option>
            {sales.length > 0 ? (
              sales.map((s) => (
                <option key={s._id} value={s.saleName}>
                  {s.saleName}
                </option>
              ))
            ) : (
              <option value="">Không có giảm giá</option>
            )}
          </select>
        </div>
        <div className="mb-3">
          <label>Ảnh sản phẩm</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setAvatar(e.target.files[0])}
          />
        </div>
        <button type="submit" className="btn btn-success" disabled={isLoading}>
          {isLoading ? 'Đang tạo...' : 'Thêm sản phẩm'}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
