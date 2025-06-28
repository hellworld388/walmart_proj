import React, { useState } from 'react';
import axios from 'axios';
import '../styles/LoginPage.css'; // Importing from styles directory

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:3000/login', {
        email,
        password
      });
      onLogin(res.data.manager);
    } catch (err) {
      console.error("Login error:", err);
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">🔐 Store Manager Login</h2>

        <label className="login-label">Email</label>
        <input
          className="login-input"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <label className="login-label">Password</label>
        <input
          className="login-input"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button className="login-button" onClick={handleLogin}>
          🚀 Login
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
