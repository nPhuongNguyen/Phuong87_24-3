// src/components/Categories/EditCategoryForm.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCategoryById, updateCategory } from '../../api/CategoriesAPI';

const EditCategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    categoryName: '',
    description: ''
  });
  const [status, setStatus] = useState({ loading: false, message: '', error: '' });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setStatus(prev => ({ ...prev, loading: true }));
        const data = await getCategoryById(id);
        setCategory({
          categoryName: data.categoryName,
          description: data.description
        });
        setStatus(prev => ({ ...prev, loading: false }));
      } catch (error) {
        setStatus(prev => ({ ...prev, loading: false, error: error.message || 'Lỗi khi tải danh mục' }));
      }
    };
    fetchCategory();
  }, [id]);

  const handleChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setStatus({ loading: true, message: '', error: '' });
      await updateCategory(id, category);
      setStatus({ loading: false, message: 'Cập nhật thành công!', error: '' });
      setTimeout(() => navigate('/categories'), 1500);
    } catch (error) {
      setStatus({ loading: false, message: '', error: error.message || 'Lỗi khi cập nhật' });
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h3 className="mb-4">Chỉnh sửa danh mục</h3>

        {status.message && <div className="alert alert-success">{status.message}</div>}
        {status.error && <div className="alert alert-danger">{status.error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Tên danh mục</label>
            <input
              type="text"
              name="categoryName"
              className="form-control"
              value={category.categoryName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mô tả</label>
            <textarea
              name="description"
              className="form-control"
              value={category.description}
              onChange={handleChange}
              rows={4}
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary" disabled={status.loading}>
            {status.loading ? 'Đang cập nhật...' : 'Lưu thay đổi'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryForm;
