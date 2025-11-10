import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../app/hooks';
import {
  Box,
  TextField,
  Button,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const ContratForm = ({ contrat, onSubmit, onCancel, errors }) => {
  const { agents } = useAppSelector((state) => state.agents);
  const { stateContrats } = useAppSelector((state) => state.stateContrats);

  const [formData, setFormData] = useState({
    agent_id: '',
    type: 'CDD',
    date_debut: null,
    date_fin: null,
    montant_total: '',
    montant_net: '',
    montant_retenu: '',
    fonction: '',
    state_contrat_id: ''
  });

  useEffect(() => {
    if (contrat && contrat.id) {
      setFormData({
        agent_id: contrat.agent_id || '',
        type: contrat.type || 'CDD',
        date_debut: contrat.date_debut ? dayjs(contrat.date_debut) : null,
        date_fin: contrat.date_fin ? dayjs(contrat.date_fin) : null,
        montant_total: contrat.montant_total || '',
        montant_net: contrat.montant_net || '',
        montant_retenu: contrat.montant_retenu || '',
        fonction: contrat.fonction || '',
        state_contrat_id: contrat.state_contrat_id || ''
      });
    }
  }, [contrat]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Nettoyer les données
    const cleanData = {
      agent_id: Number(formData.agent_id),
      type: formData.type,
      date_debut: formData.date_debut ? dayjs(formData.date_debut).format('YYYY-MM-DD') : '',
      date_fin: formData.date_fin ? dayjs(formData.date_fin).format('YYYY-MM-DD') : '',
      montant_total: Number(formData.montant_total),
      montant_net: Number(formData.montant_net),
      montant_retenu: Number(formData.montant_retenu),
      fonction: formData.fonction,
      state_contrat_id: formData.state_contrat_id ? Number(formData.state_contrat_id) : undefined
    };

    // Retirer les champs vides optionnels
    if (!cleanData.state_contrat_id) {
      delete cleanData.state_contrat_id;
    }

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

      <FormControl fullWidth margin="normal" required error={!!getFieldError('agent_id')}>
        <InputLabel>Agent</InputLabel>
        <Select
          name="agent_id"
          value={formData.agent_id}
          onChange={handleChange}
          label="Agent"
        >
          <MenuItem value="">Sélectionner un agent</MenuItem>
          {agents.map((agent) => (
            <MenuItem key={agent.id} value={agent.id}>
              {agent.prenom} {agent.nom} ({agent.matricule})
            </MenuItem>
          ))}
        </Select>
        {getFieldError('agent_id') && (
          <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, ml: 2 }}>
            {getFieldError('agent_id')}
          </Box>
        )}
      </FormControl>

      <FormControl fullWidth margin="normal" required>
        <InputLabel>Type de contrat</InputLabel>
        <Select
          name="type"
          value={formData.type}
          onChange={handleChange}
          label="Type de contrat"
        >
          <MenuItem value="CDD">CDD</MenuItem>
          <MenuItem value="CDI">CDI</MenuItem>
          <MenuItem value="Stage">Stage</MenuItem>
          <MenuItem value="Autre">Autre</MenuItem>
        </Select>
      </FormControl>

      <DatePicker
        label="Date de début *"
        value={formData.date_debut}
        onChange={(newValue) => handleDateChange('date_debut', newValue)}
        slotProps={{
          textField: {
            fullWidth: true,
            margin: 'normal',
            required: true,
            error: !!getFieldError('date_debut'),
            helperText: getFieldError('date_debut')
          }
        }}
      />

      <DatePicker
        label="Date de fin *"
        value={formData.date_fin}
        onChange={(newValue) => handleDateChange('date_fin', newValue)}
        minDate={formData.date_debut}
        slotProps={{
          textField: {
            fullWidth: true,
            margin: 'normal',
            required: true,
            error: !!getFieldError('date_fin'),
            helperText: getFieldError('date_fin') || 'Doit être supérieure à la date de début'
          }
        }}
      />

      <TextField
        fullWidth
        label="Montant total *"
        name="montant_total"
        type="number"
        value={formData.montant_total}
        onChange={handleChange}
        required
        margin="normal"
        error={!!getFieldError('montant_total')}
        helperText={getFieldError('montant_total') || 'En FCFA'}
      />

      <TextField
        fullWidth
        label="Montant net *"
        name="montant_net"
        type="number"
        value={formData.montant_net}
        onChange={handleChange}
        required
        margin="normal"
        error={!!getFieldError('montant_net')}
        helperText={getFieldError('montant_net') || 'En FCFA'}
      />

      <TextField
        fullWidth
        label="Montant retenu *"
        name="montant_retenu"
        type="number"
        value={formData.montant_retenu}
        onChange={handleChange}
        required
        margin="normal"
        error={!!getFieldError('montant_retenu')}
        helperText={getFieldError('montant_retenu') || 'En FCFA - Montant net + Montant retenu = Montant total'}
      />

      <TextField
        fullWidth
        label="Fonction *"
        name="fonction"
        value={formData.fonction}
        onChange={handleChange}
        required
        margin="normal"
        error={!!getFieldError('fonction')}
        helperText={getFieldError('fonction') || 'Ex: Développeur, Comptable, Manager...'}
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>État du contrat</InputLabel>
        <Select
          name="state_contrat_id"
          value={formData.state_contrat_id}
          onChange={handleChange}
          label="État du contrat"
        >
          <MenuItem value="">Non défini</MenuItem>
          {stateContrats.map((state) => (
            <MenuItem key={state.id} value={state.id}>
              {state.nom}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button onClick={onCancel} variant="outlined">
          Annuler
        </Button>
        <Button type="submit" variant="contained" color="primary">
          {contrat?.id ? 'Modifier' : 'Créer'}
        </Button>
      </Box>
    </Box>
  );
};

export default ContratForm;
