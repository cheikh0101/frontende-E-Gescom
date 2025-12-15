import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  Paper,
  Typography,
  Divider
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Cancel as CancelIcon } from '@mui/icons-material';

const BanqueForm = ({ banque, onSubmit, onCancel, errors = null }) => {
  const [formData, setFormData] = useState({
    code: '',
    nom: '',
    diminutif: '',
    adresse: ''
  });

  useEffect(() => {
    if (banque) {
      setFormData({
        code: banque.code || '',
        nom: banque.nom || '',
        diminutif: banque.diminutif || '',
        adresse: banque.adresse || ''
      });
    }
  }, [banque]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ code: '', nom: '', diminutif: '', adresse: '' });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {errors && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {typeof errors === 'string' ? errors : (
            <Box>
              <strong>Erreurs de validation :</strong>
              <ul style={{ marginTop: '8px', marginBottom: 0 }}>
                {Object.entries(errors).map(([field, messages]) => (
                  <li key={field}>
                    <strong>{field}:</strong> {Array.isArray(messages) ? messages.join(', ') : messages}
                  </li>
                ))}
              </ul>
            </Box>
          )}
        </Alert>
      )}
      
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
        {banque?.id && (
          <>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
              Modifier les informations de la banque
            </Typography>
            <Divider sx={{ mb: 3 }} />
          </>
        )}
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            fullWidth
            required
            label="Code de la banque"
            name="code"
            value={formData.code}
            onChange={handleChange}
            variant="outlined"
            disabled={!!banque?.id}
            error={!!(errors?.code)}
            helperText={errors?.code?.[0] || (banque?.id ? "Le code ne peut pas être modifié" : "Code unique de la banque")}
            size="medium"
          />
          
          <TextField
            fullWidth
            required
            label="Nom de la banque"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            variant="outlined"
            error={!!(errors?.nom)}
            helperText={errors?.nom?.[0] || "Nom complet de la banque"}
            size="medium"
          />
          
          <TextField
            fullWidth
            label="Diminutif"
            name="diminutif"
            value={formData.diminutif}
            onChange={handleChange}
            variant="outlined"
            placeholder="Ex: BCM, SGMR, BNM..."
            error={!!(errors?.diminutif)}
            helperText={errors?.diminutif?.[0] || "Abréviation de la banque (optionnel)"}
            size="medium"
          />
          
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Adresse"
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
            variant="outlined"
            placeholder="Ex: Avenue Gamal Abdel Nasser, Nouakchott..."
            error={!!(errors?.adresse)}
            helperText={errors?.adresse?.[0] || "Adresse complète de la banque (optionnel)"}
            size="medium"
          />
          
          <Divider sx={{ my: 1 }} />
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
            {onCancel && (
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<CancelIcon />}
                onClick={onCancel}
                size="large"
                sx={{ minWidth: 140 }}
              >
                Annuler
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={banque?.id ? <EditIcon /> : <AddIcon />}
              size="large"
              sx={{ minWidth: 140 }}
            >
              {banque?.id ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default BanqueForm;
