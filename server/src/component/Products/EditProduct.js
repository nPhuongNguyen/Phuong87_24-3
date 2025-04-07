import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateProduct, getProductById } from '../../api/ProductsAPI';
import { getCategories } from '../../api/CategoriesAPI';
import { getSales } from '../../api/SaleAPI';

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    productName: '',
    price: '',
    quantity: '',
    description: '',
    category: '',
    sale: ''
  });
  const [avatar, setAvatar] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  
  const [categories, setCategories] = useState([]);
  const [sales, setSales] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load dữ liệu sản phẩm và danh mục
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load product data
        const productRes = await getProductById(id);
        if (productRes) {
          setFormData({
            productName: productRes.productName,
            price: productRes.price,
            quantity: productRes.quantity,
            description: productRes.description || '',
            category: productRes.category || '',
            sale: productRes.sale || ''
          });
          setPreviewImage(productRes.imgURL || '');
        }

        // Load categories and sales
        const catRes = await getCategories();
        const saleRes = await getSales();
        setCategories(catRes || []);
        setSales(saleRes.data || []);
      } catch (err) {
        console.error('Lỗi khi load dữ liệu', err);
        setMessage('Lỗi khi tải dữ liệu sản phẩm');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      // Tạo preview ảnh
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.productName || !formData.price || !formData.quantity || !formData.category) {
      setMessage('Vui lòng điền đủ thông tin bắt buộc!');
      return;
    }

    const data = new FormData();
    data.append('productName', formData.productName);
    data.append('price', formData.price);
    data.append('quantity', formData.quantity);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('sale', formData.sale);
    if (avatar) data.append('avatar', avatar);

    try {
      setIsLoading(true);
      await updateProduct(id, data);
      setMessage('Cập nhật sản phẩm thành công! Đang chuyển hướng...');
      
      setTimeout(() => {
        navigate('/products');
      }, 1500);
    } catch (err) {
      setMessage(err.message || 'Lỗi khi cập nhật sản phẩm');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Cập nhật sản phẩm</h2>
      {message && (
        <div className={`alert ${message.includes('Lỗi') ? 'alert-danger' : 'alert-success'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label>Tên sản phẩm</label>
          <input
            className="form-control"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-3">
          <label>Giá</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-3">
          <label>Số lượng</label>
          <input
            type="number"
            className="form-control"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-3">
          <label>Mô tả</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        
        <div className="mb-3">
          <label>Danh mục</label>
          <select
            className="form-control"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.categoryName}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-3">
          <label>Giảm giá</label>
          <select
            className="form-control"
            name="sale"
            value={formData.sale}
            onChange={handleChange}
          >
            <option value="">-- Không giảm giá --</option>
            {sales.map(s => (
              <option key={s._id} value={s._id}>
                {s.saleName} ({s.discountPercent}%)
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-3">
          <label>Ảnh sản phẩm</label>
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
            accept="image/*"
          />
          {previewImage && (
            <div className="mt-2">
              <img 
                src={previewImage} 
                alt="Preview" 
                style={{ maxWidth: '200px', maxHeight: '200px' }} 
              />
              <p className="text-muted mt-1">Ảnh hiện tại</p>
            </div>
          )}
        </div>
        
        <div className="d-flex gap-2">
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isLoading}
          >
            {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
          </button>
          
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/products')}
          >
            Quay lại
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;