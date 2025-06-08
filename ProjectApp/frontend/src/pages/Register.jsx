import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { REGISTER_USER } from '../services/graphql';
import { saveToken } from '../services/auth';  // <--- Import this

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [register, { loading, error }] = useMutation(REGISTER_USER);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register({ variables: form });
      if (res.data?.register?.token) {
        // Save token and user info to localStorage
        saveToken(res.data.register.token, res.data.register.user);

        alert('🎉 Registered successfully! You are now logged in.');

        // Optionally redirect to home or somewhere else
        // navigate('/');
      } else {
        alert('⚠️ Registration succeeded but no token returned.');
      }
    } catch (err) {
      console.error('❌ Error during registration:', err);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          className="form-input"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          className="form-input"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          className="form-input"
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <button type="submit" className="form-button" disabled={loading}>
          Register
        </button>
        {loading && <p>Loading...</p>}
        {error && <p className="error-message">❌ {error.message}</p>}
      </form>
    </div>
  );
}
