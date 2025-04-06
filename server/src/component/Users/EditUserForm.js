import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUser, updateUser } from '../../api/UsersAPI';

const UpdateUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState({
    email: '',
    fullName: '',
    password: '',
    avatar: null,
    currentAvatar: ''
  });
  const [status, setStatus] = useState({
    message: '',
    error: '',
    loading: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setStatus(prev => ({...prev, loading: true}));
        const response = await getUser(id); 
        
        setUser({
          email: response.data.email, 
          fullName: response.data.fullName,
          password: '',
          avatar: null,
          currentAvatar: response.data.avatarUrl || ''
        });
      } catch (error) {
        setStatus(prev => ({
          ...prev, 
          error: error.response?.data?.message || error.message
        }));
      } finally {
        setStatus(prev => ({...prev, loading: false}));
      }
    };
  
    fetchUser();
  }, [id]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        setUser({
          ...user,
          avatar: file,
          currentAvatar: event.target.result // Hiển thị preview ảnh mới
        });
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setUser({...user, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', error: '' });
  
    try {
      const formData = new FormData();
      formData.append('email', user.email);
      formData.append('fullName', user.fullName);
      if (user.password) formData.append('password', user.password);
      if (user.avatar) formData.append('avatar', user.avatar);
  
      const response = await updateUser(id, formData);
        if (response.success) {
        setStatus({
            loading: false,
            message: 'Cập nhật thành công!',
            error: ''
        });

        setTimeout(() => navigate('/users'), 2000);
        } else {
        throw new Error(response.message || 'Cập nhật không thành công');
        }

    } catch (error) {
      setStatus({
        loading: false,
        message: '',
        error: error.message || 'Có lỗi xảy ra khi cập nhật'
      });
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">Cập nhật người dùng</h2>
      {status.message && (
        <div className="alert alert-success">{status.message}</div>
      )}
      
      {status.error && (
        <div className="alert alert-danger">{status.error}</div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={user.email}
            onChange={handleChange}
            required
            disabled={status.loading}
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Họ và tên:</label>
          <input
            type="text"
            name="fullName"
            className="form-control"
            value={user.fullName}
            onChange={handleChange}
            required
            disabled={status.loading}
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Mật khẩu (để trống nếu không đổi):</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={user.password}
            onChange={handleChange}
            disabled={status.loading}
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Avatar:</label>
          
          {/* Hiển thị avatar hiện tại hoặc preview avatar mới */}
          {user.currentAvatar && (
            <div className="mb-2">
              <img 
                src={user.currentAvatar} 
                alt="Avatar hiện tại" 
                className="img-thumbnail" 
                style={{ maxWidth: '200px' }}
              />
            </div>
          )}
          
          <input 
            type="file" 
            className="form-control"
            onChange={handleFileChange}
            disabled={status.loading}
            accept="image/*"
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={status.loading}
        >
          {status.loading ? 'Đang xử lý...' : 'Cập nhật'}
        </button>
      </form>
    </div>
  );
};

export default UpdateUser;