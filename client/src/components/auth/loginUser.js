// components/LoginForm.js
import React, { useState } from 'react';
import { loginUser } from '../../api/authAPI'; 
import { useNavigate } from 'react-router-dom'; 

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await loginUser(username, password);
      setMessage('Đăng nhập thành công!');
      console.log(result);
      if (result.token) {
        localStorage.setItem('token', result.token);
      }
      navigate('/products');
    } catch (error) {
      setMessage(error.message || 'Có lỗi xảy ra khi đăng nhập');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Đăng nhập</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Tên người dùng</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Mật khẩu</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
