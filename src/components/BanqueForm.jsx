import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Cancel as CancelIcon } from '@mui/icons-material';

const BanqueForm = ({ banque, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    code: '',
    nom: '',
    guichet: '',
    numero_compte: '',
    iban: ''
  });

  useEffect(() => {
    if (banque) {
      setFormData({
        code: banque.code || '',
        nom: banque.nom || '',
        guichet: banque.guichet || '',
        numero_compte: banque.numero_compte || '',
        iban: banque.iban || ''
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
    setFormData({ code: '', nom: '', guichet: '', numero_compte: '', iban: '' });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            label="Code de la banque"
            name="code"
            value={formData.code}
            onChange={handleChange}
            variant="outlined"
            disabled={!!banque?.id}
            helperText={banque?.id ? "Le code ne peut pas être modifié" : "Code unique de la banque"}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            label="Nom de la banque"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            variant="outlined"
            helperText="Nom complet de la banque"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Guichet"
            name="guichet"
            value={formData.guichet}
            onChange={handleChange}
            variant="outlined"
            placeholder="Ex: 12345"
            helperText="Code guichet (optionnel)"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            label="Numéro de compte"
            name="numero_compte"
            value={formData.numero_compte}
            onChange={handleChange}
            variant="outlined"
            placeholder="Ex: 1234567890"
            helperText="Numéro de compte bancaire"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            label="IBAN"
            name="iban"
            value={formData.iban}
            onChange={handleChange}
            variant="outlined"
            placeholder="Ex: FR7612345678901234567890123"
            helperText="Code IBAN international"
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
            {onCancel && (
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<CancelIcon />}
                onClick={onCancel}
                size="large"
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
            >
              {banque?.id ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BanqueForm;
