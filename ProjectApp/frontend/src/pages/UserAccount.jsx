import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { UPDATE_USER, DELETE_USER } from '../services/graphql';
import { getUser, clearAuth, saveUser } from '../services/auth';
import { useNavigate } from 'react-router-dom';

const ME_QUERY = gql`
  query {
    me {
      _id
      name
      email
      tradeId
    }
  }
`;

export default function UserAccount() {
  const navigate = useNavigate();
  const { data, loading: meLoading, error: meError } = useQuery(ME_QUERY);
  const [form, setForm] = useState({ name: '', email: '' });
  const [tradeId, setTradeId] = useState('');

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
    if (data?.me) {
      setForm({
        name: data.me.name ?? '',
        email: data.me.email ?? '',
      });
      setTradeId(data.me.tradeId);
    }
  }, [data]);

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

  if (meLoading) return <p>Loading account...</p>;
  if (meError) return <p>Error fetching user: {meError.message}</p>;

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

      <div className="trade-id-display" style={{ marginTop: '1rem' }}>
        <strong>🧾 Your Trade ID:</strong>
        <pre style={{
          background: '#f4f4f4',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          fontFamily: 'monospace',
          fontSize: '1rem',
          marginTop: '0.5rem'
        }}>{tradeId}</pre>
        <small>Share this with friends to let them trade with you.</small>
      </div>

      <div className="account-buttons" style={{ marginTop: '1rem' }}>
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
