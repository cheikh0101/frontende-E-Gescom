import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(register(form));
    if (register.fulfilled.match(resultAction)) {
      navigate('/login');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nom"
          value={form.name}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: 12 }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: 12 }}
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: 12 }}
        />
        <button type="submit" style={{ width: '100%' }} disabled={isLoading}>
          {isLoading ? 'Inscription...' : "S'inscrire"}
        </button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
    </div>
  );
};

export default Register;
