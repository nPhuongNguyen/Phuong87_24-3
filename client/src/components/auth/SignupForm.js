import React, { useState } from 'react';
import { signupUser } from '../../api/authAPI';

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [avatarUrl] = useState('');
  const [role] = useState('User');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signupUser(username, password, email, fullName, avatarUrl, role);
      setMessage('Đăng ký thành công!');
      console.log(result);
    } catch (error) {
      setMessage(error.message || 'Có lỗi xảy ra khi đăng ký');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Đăng ký</h2>
      {message && <div>{message}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên người dùng"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Họ và tên"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />      
        <button type="submit">Đăng ký</button>
      </form>
    </div>
  );
};

export default SignupForm;
