import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_USER, DELETE_USER } from '../services/graphql';
import { getUser, clearAuth, saveUser } from '../services/auth';
import { useNavigate } from 'react-router-dom';

export default function UserAccount() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '' });

  const [updateUser, { loading, error }] = useMutation(UPDATE_USER, {
    onCompleted: (data) => {
      if (data?.updateUser) {
        saveUser(data.updateUser);
        alert('✅ Account updated successfully!');
      }
    },
  });

  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted: () => {
      clearAuth();
      alert('🗑️ Account deleted');
      navigate('/register');
    },
    onError: (err) => {
      alert('❌ Delete failed: ' + err.message);
    }
  });

  useEffect(() => {
    const storedUser = getUser();
    if (storedUser) {
      setForm({
        name: storedUser.name ?? '',
        email: storedUser.email ?? '',
      });
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ variables: form });
    } catch (err) {
      console.error('Update failed:', err.message);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('⚠️ Are you sure you want to delete your account? This cannot be undone.');
    if (confirmDelete) {
      await deleteUser();
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <h2>Update Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update'}
        </button>
        {error && <p className="error-message">❌ {error.message}</p>}
      </form>

      <div className="account-buttons">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
        <button className="delete-button" onClick={handleDelete}>
          Delete Account
        </button>
      </div>
    </div>
  );
}
