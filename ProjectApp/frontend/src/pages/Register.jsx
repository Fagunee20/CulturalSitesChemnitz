import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { REGISTER_USER } from '../services/graphql';
import { saveToken } from '../services/auth';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [register, { loading, error }] = useMutation(REGISTER_USER);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📤 Sending form:', form); // 👈 Check values
    try {
      const res = await register({ variables: form });
      console.log('✅ Response:', res);

      if (res.data?.register?.token) {
        saveToken(res.data.register.token);
        alert('🎉 Registered successfully!');
      } else {
        alert('⚠️ No token returned.');
      }
    } catch (err) {
      console.error('❌ Error during registration:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
      />
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />
      <button type="submit" disabled={loading}>
        Register
      </button>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>❌ {error.message}</p>}
    </form>
  );
}
