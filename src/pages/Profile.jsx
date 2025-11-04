import React, { useState } from 'react';
import { useAppSelector } from '../app/hooks';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Card,
  CardContent,
  Divider,
  Alert
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Save as SaveIcon
} from '@mui/icons-material';

const Profile = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // TODO: Implémenter la mise à jour du profil via API
    setSuccessMessage('Profil mis à jour avec succès');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      setErrorMessage('Les mots de passe ne correspondent pas');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    // TODO: Implémenter le changement de mot de passe via API
    setSuccessMessage('Mot de passe modifié avec succès');
    setPasswordData({
      current_password: '',
      new_password: '',
      new_password_confirmation: '',
    });
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <PersonIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 0, fontWeight: 600 }}>
            Mon Profil
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gérez vos informations personnelles et votre sécurité
          </Typography>
        </Box>
      </Box>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Carte de profil */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  margin: '0 auto',
                  fontSize: 48,
                  bgcolor: 'primary.main',
                  mb: 2
                }}
              >
                {getInitials(user?.name)}
              </Avatar>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                {user?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user?.email}
              </Typography>
              {user?.roles && user.roles.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Rôles
                  </Typography>
                  {user.roles.map((role) => (
                    <Typography key={role.id} variant="body2" sx={{ fontWeight: 500 }}>
                      {role.nom}
                    </Typography>
                  ))}
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Formulaires */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <EmailIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Informations personnelles
              </Typography>
            </Box>
            
            <Box component="form" onSubmit={handleProfileSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nom complet"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    required
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  size="large"
                >
                  Enregistrer
                </Button>
              </Box>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <LockIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Changer le mot de passe
              </Typography>
            </Box>
            
            <Box component="form" onSubmit={handlePasswordSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mot de passe actuel"
                    name="current_password"
                    type="password"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nouveau mot de passe"
                    name="new_password"
                    type="password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirmer le mot de passe"
                    name="new_password_confirmation"
                    type="password"
                    value={passwordData.new_password_confirmation}
                    onChange={handlePasswordChange}
                    required
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  startIcon={<LockIcon />}
                  size="large"
                >
                  Modifier le mot de passe
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
