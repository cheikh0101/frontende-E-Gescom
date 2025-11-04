import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material';
import { useAppSelector } from '../app/hooks';

const EtatPaiementForm = ({ etatPaiement, onSubmit, onCancel }) => {
  const { agents } = useAppSelector((state) => state.agents);
  
  const [formData, setFormData] = useState({
    periode: '',
    agent_id: '',
    type: '',
    montant_total: '',
    montant_net: '',
    montant_retenu: '',
    fichier: ''
  });

  useEffect(() => {
    if (etatPaiement) {
      setFormData({
        periode: etatPaiement.periode || '',
        agent_id: etatPaiement.agent_id || '',
        type: etatPaiement.type || '',
        montant_total: etatPaiement.montant_total || '',
        montant_net: etatPaiement.montant_net || '',
        montant_retenu: etatPaiement.montant_retenu || '',
        fichier: etatPaiement.fichier || ''
      });
    }
  }, [etatPaiement]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Période"
            name="periode"
            value={formData.periode}
            onChange={handleChange}
            required
            helperText="Ex: Janvier 2025, Q1 2025, etc."
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Agent</InputLabel>
            <Select
              name="agent_id"
              value={formData.agent_id}
              onChange={handleChange}
              label="Agent"
            >
              {agents.map((agent) => (
                <MenuItem key={agent.id} value={agent.id}>
                  {agent.prenom} {agent.nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            helperText="Ex: Salaire, Prime, Indemnité, etc."
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Montant total"
            name="montant_total"
            type="number"
            value={formData.montant_total}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: <InputAdornment position="start">FCFA</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Montant net"
            name="montant_net"
            type="number"
            value={formData.montant_net}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: <InputAdornment position="start">FCFA</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Montant retenu"
            name="montant_retenu"
            type="number"
            value={formData.montant_retenu}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: <InputAdornment position="start">FCFA</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Fichier (URL)"
            name="fichier"
            value={formData.fichier}
            onChange={handleChange}
            helperText="URL du fichier de l'état de paiement (optionnel)"
          />
        </Grid>
      </Grid>
      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button onClick={onCancel} color="inherit">
          Annuler
        </Button>
        <Button type="submit" variant="contained" color="primary">
          {etatPaiement?.id ? 'Mettre à jour' : 'Ajouter'}
        </Button>
      </Box>
    </Box>
  );
};

export default EtatPaiementForm;
