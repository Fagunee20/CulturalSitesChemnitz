// Register page
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { REGISTER_USER } from '../services/graphql';
import { saveToken } from '../services/auth';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [register, { data, loading, error }] = useMutation(REGISTER_USER);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await register({ variables: form });
    if (res.data.register.token) saveToken(res.data.register.token);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <button type="submit">Register</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
    </form>
  );
}