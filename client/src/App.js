import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'; // Chỉ import Routes và Route
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import SignupForm from './components/auth/SignupForm';
import LoginUser from './components/auth/loginUser';
import CartItems from './components/CartItems';
import OrderList from './components/OrderList';
import Checkout from './components/Checkout';
import OrderDetail from './components/OrderDetail';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaSearch, FaUserCircle, FaSignOutAlt, FaStore } from 'react-icons/fa';
import { checkAuthentication } from './api/authAPI';
import { getCartItems } from './api/CartItemDBAPI';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  const [user, setUser] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
   useEffect(() => {
      const fetchData = async () => {
        try {
          const [userData] = await Promise.all([
            checkAuthentication()
          ]);
    
          let cartCount = 0;
          try {
            const cartItems = await getCartItems();
            cartCount = Array.isArray(cartItems) ? cartItems.length : 0;
          } catch (cartError) {
            console.warn('Không thể tải giỏ hàng:', cartError.message);
          }
          
          if (userData) setUser(userData);
          setCartItemCount(cartCount); 
    
        } catch (err) {
          console.error('Lỗi khi tải dữ liệu người dùng:', err);
        }
      };
    
      fetchData();
    }, []);

    const handleLogout = () => {
      localStorage.removeItem('token');
      setUser(null);
      window.location.reload();
    };
  return (
    <div className="App">
       <header className="bg-white shadow-sm sticky-top">
        <div className="container py-3">
          <div className="row align-items-center">
            <div className="col-auto">
              <Link to="/" className="text-decoration-none">
                <div className="d-flex align-items-center">
                  <FaStore className="text-primary me-2" size={24} />
                  <h1 className="h4 mb-0 fw-bold text-primary">Cosmetics</h1>
                </div>
              </Link>
            </div>
            
            <div className="col position-relative">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <FaSearch className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Tìm kiếm sản phẩm..."
                />
              </div>
            </div>
            
            <div className="col-auto d-flex align-items-center gap-3">
              <Link to="/cart" className="btn btn-outline-primary position-relative">
                <FaShoppingCart className="me-2" />
                Giỏ hàng
                {cartItemCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              
              {user ? (
                <div className="dropdown">
                  <button className="btn btn-outline-secondary dropdown-toggle" type="button" id="userMenu" data-bs-toggle="dropdown" aria-expanded="false">
                    <FaUserCircle className="me-2" />
                    {user.email.split('@')[0]}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="userMenu">
                    <li><Link className="dropdown-item" to="/profile">Tài khoản của tôi</Link></li>
                    <li><Link className="dropdown-item" to="/orders">Đơn hàng của tôi</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <FaSignOutAlt className="me-2" />
                        Đăng xuất
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link to="/login" className="btn btn-primary">
                  Đăng nhập / Đăng ký
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4" style={{ minHeight: 'calc(100vh - 200px)' }}>
        <Routes> {/* Không bọc thêm Router ở đây */}
          <Route path="/" element={<ProductList />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<LoginUser />} />
          <Route path="/cart" element={<CartItems />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
        </Routes>
      </main>
      
     {/* Footer */}
     <footer className="bg-white border-top mt-5 py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-3 mb-md-0">
              <h5 className="mb-3 text-primary">Cosmetics</h5>
              <p className="text-muted">Cung cấp các sản phẩm chất lượng với giá cả hợp lý.</p>
            </div>
            <div className="col-md-4 mb-3 mb-md-0">
              <h5 className="mb-3">Liên hệ</h5>
              <ul className="list-unstyled">
                <li className="mb-2">Email: phuong0909tt@gmail.com</li>
                <li className="mb-2">Điện thoại: 0328700868</li>
                <li>Địa chỉ: Quận 2, thành phố Hồ Chí Minh</li>
              </ul>
            </div>
            <div className="col-md-4">
              <h5 className="mb-3">Theo dõi chúng tôi</h5>
              <div className="d-flex gap-3">
                <a href="https://www.facebook.com/duyphuong0412" className="text-decoration-none">
                  <i className="bi bi-facebook fs-4"></i>
                </a>
                <a href="https://www.facebook.com/duyphuong0412" className="text-decoration-none">
                  <i className="bi bi-instagram fs-4"></i>
                </a>
                <a href="https://www.facebook.com/duyphuong0412" className="text-decoration-none">
                  <i className="bi bi-twitter fs-4"></i>
                </a>
              
              </div>
            </div>
          </div>
          <div className="border-top mt-4 pt-3 text-center">
            <p className="text-muted small mb-0">© 2025 Cosmetics</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;