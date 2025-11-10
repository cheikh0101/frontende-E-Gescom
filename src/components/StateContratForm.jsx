import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert
} from '@mui/material';

const StateContratForm = ({ stateContrat, onSubmit, onCancel, errors }) => {
  const [formData, setFormData] = useState({
    code: '',
    nom: ''
  });

  useEffect(() => {
    if (stateContrat && stateContrat.id) {
      setFormData({
        code: stateContrat.code || '',
        nom: stateContrat.nom || ''
      });
    }
  }, [stateContrat]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Nettoyer les données
    const cleanData = {
      code: formData.code,
      nom: formData.nom
    };

    onSubmit(cleanData);
  };

  const getFieldError = (fieldName) => {
    if (errors && typeof errors === 'object' && errors.errors) {
      return errors.errors[fieldName] ? errors.errors[fieldName][0] : null;
    }
    return null;
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {errors && errors.message && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.message}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Code *"
        name="code"
        value={formData.code}
        onChange={handleChange}
        required
        margin="normal"
        error={!!getFieldError('code')}
        helperText={getFieldError('code') || 'Ex: EN_COURS, EXPIRE, RESILIE, SUSPENDU, RENOUVELE'}
      />

      <TextField
        fullWidth
        label="Nom *"
        name="nom"
        value={formData.nom}
        onChange={handleChange}
        required
        margin="normal"
        error={!!getFieldError('nom')}
        helperText={getFieldError('nom') || 'Ex: En cours, Expiré, Résilié, Suspendu, Renouvelé'}
      />

      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button onClick={onCancel} variant="outlined">
          Annuler
        </Button>
        <Button type="submit" variant="contained" color="primary">
          {stateContrat?.id ? 'Modifier' : 'Créer'}
        </Button>
      </Box>
    </Box>
  );
};

export default StateContratForm;
