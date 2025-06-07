import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../services/graphql';
import { saveToken } from '../services/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [login, { loading, error }] = useMutation(LOGIN_USER);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ variables: form });
      if (res.data?.login?.token) {
        const token = res.data.login.token;
        const user = res.data.login.user;
        saveToken(token, user); // ✅ Save both token and name
        alert('🎉 Logged in successfully!');
        navigate('/');
      } else {
        alert('⚠️ Login failed. No token received.');
      }
    } catch (err) {
      console.error('Login error:', err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p>❌ {error.message}</p>}
      </form>
    </div>
  );
}
