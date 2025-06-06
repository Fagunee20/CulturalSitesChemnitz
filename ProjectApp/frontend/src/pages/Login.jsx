// pages/Login.jsx
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../services/graphql';
import { saveToken } from '../services/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [login, { loading, error }] = useMutation(LOGIN_USER);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await login({ variables: form });
    if (res.data?.login?.token) {
      saveToken(res.data.login.token);
      navigate('/');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <button type="submit">Login</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
    </form>
  );
}
