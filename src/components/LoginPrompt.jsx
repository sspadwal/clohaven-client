// components/LoginPrompt.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPrompt.css';

function LoginPrompt({ onClose, onLogin, purpose = "add to cart" }) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    setIsVisible(true);
  }, []);

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className={`login-prompt-overlay ${isVisible ? 'visible' : ''}`}>
      <div className="login-prompt">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <div className="prompt-icon">🔒</div>
        <h3>Login Required</h3>
        <p>Please log in to {purpose === 'buy now' ? 'complete your purchase' : 'add items to your cart'}</p>
        <div className="prompt-actions">
          <button className="login-btn" onClick={handleLogin}>
            Go to Login
          </button>
          <button className="continue-btn" onClick={onClose}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPrompt;