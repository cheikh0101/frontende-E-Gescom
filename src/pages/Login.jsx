import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Link
} from '@mui/material';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(login(form));
    if (login.fulfilled.match(resultAction)) {
      navigate('/dashboard');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              width: 40,
              height: 40,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <LockOutlinedIcon />
          </Box>

          <Typography component="h1" variant="h5" gutterBottom>
            Connexion
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adresse email"
              name="email"
              autoComplete="email"
              autoFocus
              value={form.email}
              onChange={handleChange}
              disabled={isLoading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type="password"
              id="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              disabled={isLoading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Se connecter'
              )}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/register" variant="body2">
                {"Vous n'avez pas de compte ? Inscrivez-vous"}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
