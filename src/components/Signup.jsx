import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

function Signup({ signup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  console.log('Signup component rendering');

  const handleSignup = (e) => {
    e.preventDefault(); // Use form submission
    setMessage('');
    if (!username || !email || !password || !mobile) {
      setMessage('All fields are required');
      return;
    }
    signup(username, email, password, mobile, navigate, setMessage); // Pass all fields
  };

  return (
    <div className="auth">
      <h1>Sign Up</h1>
      {message && <span className="message">{message}</span>}
      <form onSubmit={handleSignup}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="email" // Use email type for validation
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
        <input
          type="number" // Corrected to lowercase 'number'
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="Mobile No"
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <span onClick={() => navigate('/login')}>Login</span>
      </p>
    </div>
  );
}

export default Signup;