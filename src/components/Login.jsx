import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

function Login({ login }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  console.log('Login component rendering');

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError('');

    // Client-side validation
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    login(email, password, navigate, setError);
  };

  return (
    <div className="auth">
      <h1>Login</h1>
      {error && <span className="error-message">{error}</span>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Need an account? <span onClick={() => navigate('/signup')}>Sign Up</span>
      </p>
    </div>
  );
}

export default Login;