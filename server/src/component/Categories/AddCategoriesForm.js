import React, { useState } from 'react';
import { createCategory } from '../../api/CategoriesAPI';
import { useNavigate } from 'react-router-dom';

const CreateCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
   const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await createCategory({ categoryName, description });
      setMessage('Tạo danh mục thành công!');
      setTimeout(() => navigate('/categories'), 1500);
      setCategoryName('');
      setDescription('');
      console.log('Server response:', data);
    } catch (error) {
      console.error(error);
      setMessage(error.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Tạo danh mục mới</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Tên danh mục</label>
          <input
            type="text"
            className="form-control"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Mô tả</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Tạo mới</button>
      </form>
    </div>
  );
};

export default CreateCategory;
