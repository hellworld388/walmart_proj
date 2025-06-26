import React, { useState } from 'react';
import axios from 'axios';

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
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Store Manager Login</h2>

        <label style={styles.label}>Email</label>
        <input
          style={styles.input}
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <label style={styles.label}>Password</label>
        <input
          style={styles.input}
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleLogin}>
          🚀 Login
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: 'flex',
    height: '100vh',
    background: '#f5f6fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    background: '#fff',
    padding: '30px 40px',
    borderRadius: 12,
    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
    width: 350,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#2f3640',
  },
  label: {
    fontWeight: 'bold',
    color: '#2f3640',
  },
  input: {
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #dcdde1',
    borderRadius: 6,
    outline: 'none',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#4cd137',
    color: '#fff',
    border: 'none',
    padding: '10px',
    borderRadius: 6,
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default LoginPage;
