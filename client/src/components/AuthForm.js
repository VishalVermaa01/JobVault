import React, { useState } from 'react';

const AuthForm = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin
      ? 'http://localhost:5000/api/auth/login'
      : 'http://localhost:5000/api/auth/register';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error');
      localStorage.setItem('token', data.token);
      console.log('JWT token:', data.token);
      onAuthSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        padding: '2rem 2.5rem',
        minWidth: 340,
        maxWidth: 400,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h2 style={{ color: '#f76b1c', marginBottom: 24 }}>{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ padding: 10, borderRadius: 6, border: '1px solid #eee', background: '#fafafa' }}
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ padding: 10, borderRadius: 6, border: '1px solid #eee', background: '#fafafa' }}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={{ padding: 10, borderRadius: 6, border: '1px solid #eee', background: '#fafafa' }}
          />
          <button type="submit" style={{
            background: 'linear-gradient(90deg, #fda085 0%, #f6d365 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '10px 0',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            marginTop: 8
          }}>{isLogin ? 'Login' : 'Register'}</button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} style={{
          marginTop: 18,
          background: 'none',
          border: 'none',
          color: '#f76b1c',
          fontWeight: 500,
          cursor: 'pointer',
          textDecoration: 'underline',
        }}>
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
        {error && <p style={{ color: '#e74c3c', marginTop: 10 }}>{error}</p>}
      </div>
    </div>
  );
};

export default AuthForm;
