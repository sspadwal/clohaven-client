import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import '../styles/Navbar.css';

function Navbar({ role, token, username, logout, cartItemCount = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    logout(navigate);
    setIsOpen(false);
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1>
          <NavLink to="/" className="store-logo" onClick={() => { setIsOpen(false); setIsUserMenuOpen(false); }}>
            <img src="/logo.png" alt="ClothingHaven Logo" />
          </NavLink>
        </h1>
        
        {/* Mobile controls container */}
        <div className="mobile-controls">
          {token && (
            <NavLink to="/cart" className="mobile-cart" onClick={() => setIsOpen(false)}>
              <FaShoppingCart className="nav-icon" />
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </NavLink>
          )}
          <button className={`hamburger ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
        
        <div className={`nav-links ${isOpen ? 'open' : ''}`}>
          {!token ? (
            <>
              <NavLink to="/products" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setIsOpen(false)}>Products</NavLink>
              <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setIsOpen(false)}>Login</NavLink>
              <NavLink to="/signup" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setIsOpen(false)}>Signup</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/products" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setIsOpen(false)}>Products</NavLink>
              {/* Desktop cart link - hidden on mobile */}
              <NavLink to="/cart" className={({ isActive }) => (isActive ? 'active' : '') + " desktop-cart"} onClick={() => setIsOpen(false)}>
                <div className="cart-link">
                  <FaShoppingCart className="nav-icon" />
                  {cartItemCount > 0 && (
                    <span className="cart-badge">{cartItemCount}</span>
                  )}
                  <span className="cart-text">Cart</span>
                </div>
              </NavLink>
              <div className="user-menu">
                <button 
                  className="user-menu-btn" 
                  onClick={toggleUserMenu}
                >
                  <FaUser className="nav-icon" /> 
                  {username || 'Guest'}
                </button>
                {isUserMenuOpen && (
                  <div className="user-dropdown">
                    <NavLink 
                      to="/profile" 
                      className={({ isActive }) => (isActive ? 'active' : '')} 
                      onClick={() => { setIsOpen(false); setIsUserMenuOpen(false); }}
                    >
                      <FaUser className="nav-icon" /> Profile
                    </NavLink>
                    {role === 'admin' && (
                      <NavLink 
                        to="/admin" 
                        className={({ isActive }) => (isActive ? 'active' : '')} 
                        onClick={() => { setIsOpen(false); setIsUserMenuOpen(false); }}
                      >
                        Admin Dashboard
                      </NavLink>
                    )}
                    <button 
                      onClick={handleLogout} 
                      className="logout-btn"
                    >
                      <FaSignOutAlt className="nav-icon" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;